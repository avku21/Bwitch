import { NextResponse } from "next/server";

//get all active streams
export async function GET() {
    try {
        const streamingServer = global.streamingServer
        if(!streamingServer){
            return NextResponse.json({error:"Streaming server not initialized" } , {status: 500})
        }
        const streams = streamingServer.listActiveStreams()
        return NextResponse.json({streams})

    } catch (error) {
        console.error("Error listing streams")
        return NextResponse.json({error:"Internal server error"} , {status: 500} )
    }
}

export async function POST(request) {
    try {
        const streamingServer = global.streamingServer
        if(!streamingServer){
            return NextResponse.json({error:"Streaming server is not initialized"} , {status: 500})
        }

        const body = await request.json()
        const {streamKey , port} = body

        const finalStreamKey = streamKey || streamingServer.generateStreamKey()

        const finalPort = port || (9999 + Math.floor(Math.random() * 1000))

        if(streamingServer.isStreamActive(finalStreamKey)){
            return NextResponse.json({error:"Stream key already in use"} , {status: 409 })
        }

        const streamInfo = streamingServer.startSRTServer(finalStreamKey , finalPort)
        return NextResponse.json({
            success : true , 
            stream : streamInfo
        })
    } catch (error) {
        console.error("Unable to create stream" , error)
        return NextResponse.json({error: "Internal server error"} , {status: 500})      
    }
}