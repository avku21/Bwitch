import { spawn } from 'child_process';  //runs external programs as seperate processes
import path from 'path'; //handles files and directories cross platforms
import fs from 'fs';  //file system module for reading and writing file

class StreamingServer {
    constructor() {
        this.activeStream = new Map();
        this.streamDir = path.join(process.cwd(), 'public', 'streams');
        this.ensureStreamDirExists();
    }

    ensureStreamDirExists() {
        if (!fs.existsSync(this.streamDir)) {
            fs.mkdirSync(this.streamDir, { recursive: true });
        }
    }

    startSRTServer(streamKey, port = 9999) {
        const outDir = path.join(this.streamDir, streamKey);

        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
        }

        const playlistPath = path.join(outDir, "playlist.m3u8");
        const segmentPattern = path.join(outDir, "segment_%03d.ts");

        const ffmpegArgs = [
            '-i', `srt://localhost:${port}?mode=listener&pkt_size=1316`,
            '-c:v', 'libx264',
            '-preset', 'veryfast',
            '-tune', 'zerolatency',
            '-c:a', 'aac',
            '-b:a', '128k',
            '-f', 'hls',
            '-hls_time', '2',
            '-hls_list_size', '5',
            '-hls_flags', 'delete_segments+independent_segments',
            '-hls_segment_filename', segmentPattern,
            playlistPath
        ]

        const ffmpeg = spawn("ffmpeg", ffmpegArgs)

        ffmpeg.stdout.on('data', (data) => {
            console.log(`FFmpeg Output: ${data}`);
        });

        ffmpeg.stderr.on("data", (data) => {
            console.log(`FFmpeg Error: ${data}`);
        })

        ffmpeg.on('close', (code) => {
            console.log(`FFmpeg process exited with code ${code}`);
            this.activeStream.delete(streamKey);
        })

        ffmpeg.on('error', (err) => {
            console.error("FFmpeg error: ", err)
            this.activeStream.delete(streamKey)
        })

        this.activeStream.set(streamKey, {
            process: ffmpeg,
            port,
            outDir,
            playlistPath,
            startTime: new Date()
        });

        return {
            streamKey,
            srtUrl: `srt://localhost:${port}`,
            hlsUrl: `/streams/${streamKey}/playlist.m3u8`,
            port
        }
    }

    stopStream(streamKey) {
        const stream = this.activeStream.get(streamKey);
        if (stream) {
            stream.process.kill('SIGTERM');
            this.activeStream.delete(streamKey);

            setTimeout(() => {
                this.cleanUpStream(stream.outDir);
            }, 30000)
        }
    }

    cleanUpStream(outDir) {
        if (fs.existsSync(outDir)) {
            fs.rmSync(outDir, { recursive: true, force: true });
        }
    }

    getStreamInfo(streamKey) {
        return this.activeStream.get(streamKey)
    }

    listActiveStreams() {
        const streams = []
        this.activeStream.forEach((stream, key) => {
            streams.push({
                streamKey: key,
                port: stream.port,
                startTime: stream.startTime,
                hlsUrl: `/streams/${key}/playlist.m3u8`
            })
        })
        return streams;
    }

    isStreamActive(streamKey) {
        return this.activeStream.has(streamKey)
    }

    generateStreamKey() {
        return Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
    }
}


export default StreamingServer
