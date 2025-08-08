import { error } from "console";
import { NextResponse } from "next/server";

//get stream info
export async function GET(request, { params }) {
    try {
        const streamKey = { params }
        const streamingServer = global.streamingServer
        const chatServer = global.chatServer

        if (!streamingServer || !chatServer) {
            return NextResponse.json({ error: "Servers not initialized" }, { status: 500 })
        }

        const streamInfo = streamingServer.getStramInfo(streamKey)
        if (!streamInfo) {
            return NextResponse.json({ error: "Stream not found" }, { status: 404 })
        }

        const chatInfo = chatServer.getRoomInfo(streamKey)

        return NextResponse.json({
            streamKey,
            isActive: true,
            hlsUrl: `/streams/${streamKey}/playlist.m3u8`,
            srtUrl: `srt://localhost:${streamInfo.port}`,
            startTime: streamInfo.startTime,
            viewerCount: chatInfo ? chatInfo.viewerCount : 0
        })
    } catch (error) {
        console.error("Error getting stream info")
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}


//delete existing stream
export async function DELETE(request, { params }) {
    try {
        const streamKey = { params }

        const streamingServer = global.streamingServer
        if (!streamingServer) {
            return NextResponse.json({ error: "Streaming Server not initialized" }, { status: 500 })
        }

        const success = streamingServer.stopStream(streamKey)
        if (!success) {
            return NextResponse.json({ error: "Stream not found" }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: "Stream stopped"
        })

    } catch (error) {
        console.error("Error stopping stream")
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}


