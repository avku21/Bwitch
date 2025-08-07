import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import StreamingServer from './lib/streaming_service.js'

const dev = process.env.NODE_ENV !== "production"
const hostName = 'localhost';
const port = process.env.PORT || 3000

const streamingServer = new StreamingServer();

const app = next({ dev, hostName, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const httpServer = createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req, true)
            await handle(req, res, parsedUrl)
        } catch (err) {
            console.error("Error while handling")
            res.statusCode(500)
            res.end("internal server error")
        }

        global.streamingServer = streamingServer;

        httpServer.listen(port, (err) => {
            if (err) throw err;
            console.log(`>Ready to listen on http://${hostName}:${port}`)
            console.log("Streaming server initialized")
        })

        process.on("SIGTERM", () => {
            console.log("SIGTERM received shutting down gracefully")

            //shutting down all active streams
            streamingServer.listActiveStreams().forEach(stream => {
                streamingServer.stopStream(stream.streamKey)
            });

            httpServer.close(() => {
                console.log("Server closed")
                process.exit(0)
            })
        })

        process.on("SIGINT", () => {
            console.log("SIGTERM received shutting down gracefully")

            //shutting down all active streams
            streamingServer.listActiveStreams().forEach(stream => {
                streamingServer.stopStream(stream.streamKey)
            });

            httpServer.close(() => {
                console.log("Server closed")
                process.exit(0)
            })
        })

    })
})

