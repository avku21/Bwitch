import { Server } from "socket.io";

class ChatServer {
    constructor(httpServer) {
        this.io = new Server(httpServer, {
            cors: {
                origin: process.env.NODE_ENV === 'production' ? process.env.NEXTAUTH_URL
                    : "http://localhost:3000",
                methods: ["GET", "POST"]
            }
        });

        this.room = new Map();
        this.userRoom = new Map();
        this.setUpEventHandlers();

    }

    setUpEventHandlers() {
        this.io.on("connection", (socket) => {
            console.log(`User connected : ${socket.id}`)

            socket.on("join-stream", (data) => {
                const { streamKey, userName } = data
            })

            this.leaveCurrentStream(socket)

            socket.join(streamKey)
            this.userRoom.set(socket.id, streamKey)

            if (!this.room.has(streamKey)) {
                this.room.set(streamKey, new Set())
            }
            this.room.get(streamKey).add({
                socketID: socket.id,
                username: userName || "Anonymous"
            })

            //notify that user joined 
            socket.to(streamKey).emit("user-joined", {
                username: userName || "Anonymous",
                timestamp: new Date().toISOString()
            });

            //current viewer count
            const viewerCount = this.room.get(streamKey).size;
            this.broadcastToStream(streamKey, "viewer-count", { count: viewerCount })

            console.log(`User ${userName} joined the stream ${streamKey}`)

            socket.on("chat-message", (data) => {
                const streamKey = this.userRoom.get(socket.id)
                if (!streamKey) {
                    return
                }
                const { message, userName } = data

                if (!message || message.trim().length === 0) return;
                if (message.length > 500) return

                const chatMessage = {
                    id: this.generateMessageID(),
                    username: userName || "Anonymous",
                    message: message.trim(),
                    timestamp: new Date().toISOString
                }

                this.broadcastToStream(streamKey, "chat-message", chatMessage)
                console.log(`New message in ${streamKey}: ${userName} : ${message}`)

            })
            socket.on("typing-start", (data) => {
                const streamKey = this.userRoom.get(socket.id)
                if (!streamKey) return

                socket.to(streamKey).emit("user-typinng", {
                    username: data.userName || "Anonymous"
                })
            })

            socket.on("typing-stop", (data) => {
                const streamKey = this.userRoom.get(socket.id)
                if (!streamKey) return

                socket.to(streamKey).emit("user-stop-typinng", {
                    username: data.userName || "Anonymous"
                })
            })

            socket.on("disconnect", () => {
                console.log(`User disconnected : ${socket.id}`)
                this.leaveCurrentStream(socket)
            })

        })

    }

    leaveCurrentStream(socket) {
        const streamKey = this.userRoom.get(socket.id)
        if (streamKey) {
            socket.leave(streamKey)

            const room = this.room.get(streamKey)
            if (room) {
                for (const user of room) {
                    if (user.socketID === socket.id) {
                        room.delete(user)
                        socket.to(streamKey).emit("user-left", {
                            username: user.username,
                            timestamp: new Date().toISOString()
                        })
                        break
                    }

                }
            }
            const viewerCount = room.size
            this.broadcastToStream(streamKey, "viewer-count", { count: viewerCount })

            if (room.size === 0) {
                this.room.delete(streamKey)
            }

            this.userRoom.delete(socket.id)
        }

    }

    generateMessageID() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    getRoomInfo(streamKey) {
        const room = this.room.get(streamKey)
        if (!room) return null

        return {
            streamKey,
            viewerCount: room.size,
            viewers: Array.from(room).map(user => ({
                username: user.userName
            }))
        }
    }

    getAllRooms() {
        const rooms = []
        this.room.forEach((users, streamKey) => {
            rooms.push({
                streamKey,
                viewerCount: users.size
            })
        })
        return rooms
    }

    broadcastToStream(streamKey, event, data) {
        this.io.to(streamKey).emit(event, data);
    }



}

module.exports = ChatServer;