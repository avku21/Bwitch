import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import StreamingServer from './lib/streaming_service.js'
import ChatServer from './lib/chat_service.js';

const dev = process.env.NODE_ENV !== "production"
const hostName = 'localhost';
const port = process.env.PORT || 3000

const app = next({ dev, hostName, port });
const handle = app.getRequestHandler();

const streamingServer = new StreamingServer();

app.prepare().then(() => {
    console.log("Next js app prepared successfully")

    const httpServer = createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true)
            await handle(req, res, parsedUrl)
        } catch (err) {
            console.error("Error while handling")
            res.statusCode = 500
            res.end("internal server error")
        }
    })

    const chatServer = new ChatServer(httpServer)

    global.streamingServer = streamingServer;
    global.chatServer = chatServer;


    httpServer.listen(port, (err) => {
        if (err) throw err;
        console.log(`>Ready to listen on http://${hostName}:${port}`)
        console.log("Streaming server initialized")
        console.log("Chat server initialized")
    })

    const gracefulShutdown = (signal) => {
        console.log(`${signal} received , shutting down gracefully`)
        try {
            const activeStream = streamingServer.listActiveStreams()
            if (activeStream && Array.isArray(activeStream) && activeStream.length > 0) {
                console.log(`Shutting down ${activeStream.length} streams`)
                activeStream.forEach(stream => {
                    streamingServer.stopStream(stream.streamKey)
                })
            } else {
                console.log("No strems to stop")
            }
        } catch (error) {
            console.error("Error closing strems", error)
        }

        const forceCloserTimer = setTimeout(() => {
            console.log("Force closing server...")
            process.exit(1)
        }, 5000)

        httpServer.close(() => {
            clearTimeout(forceCloserTimer)
            console.log("Server closed")
            process.exit(0)
        })
    }
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"))
    process.on("SIGINT", () => gracefulShutdown("SIGINT"))

}).catch(err => {
    console.log("Failed to start nect js app", err)
    process.exit(1)
})


