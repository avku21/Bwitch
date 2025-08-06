# Bwitch - Live Streaming Platform

A modern live streaming platform built with Next.js that supports SRT ingest, HLS output, and real-time chat functionality.

## Features

- **SRT Ingest**: Accept streams via SRT protocol for low-latency streaming
- **HLS Output**: Convert streams to HLS format for web playback
- **Real-time Chat**: WebSocket-based chat system for viewer interaction
- **Stream Management**: Dashboard for creating and managing streams
- **Responsive Design**: Works on desktop and mobile devices
- **User Authentication**: Clerk-based authentication system

## Prerequisites

Before running this project, make sure you have:

1. **Node.js** (v18 or higher)
2. **FFmpeg** installed and available in your system PATH
3. **npm** or **yarn** package manager

### Installing FFmpeg

#### macOS
```bash
brew install ffmpeg
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install ffmpeg
```

#### Windows
Download from [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html) and add to PATH.

## Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd bwitch
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
# Clerk Authentication (get these from https://clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Optional: Socket.io URL for production
NEXT_PUBLIC_SOCKET_URL=https://your-domain.com
```

4. **Start the development server**
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Usage

### Creating a Stream

1. Sign in to your account
2. Navigate to the Dashboard (click the Dashboard button in the navbar)
3. Click "Create Stream" to generate a new stream
4. Copy the SRT URL provided

### Streaming with OBS

1. Open OBS Studio
2. Go to Settings → Stream
3. Set Service to "Custom"
4. Set Server to the SRT URL (e.g., `srt://localhost:9999`)
5. Leave Stream Key empty
6. Click OK and start streaming

### Streaming with FFmpeg

```bash
ffmpeg -re -i your_video.mp4 -c copy -f mpegts "srt://localhost:9999"
```

### Viewing Streams

1. Click "Watch" next to any active stream in the Dashboard
2. Or visit `/stream/[streamKey]` directly
3. Enter a username to join the chat
4. Enjoy the stream with real-time chat!

## API Endpoints

- `GET /api/streams` - List all active streams
- `POST /api/streams` - Create a new stream
- `GET /api/streams/[streamKey]` - Get stream information
- `DELETE /api/streams/[streamKey]` - Stop a stream

## Project Structure

```
├── app/
│   ├── (auth)/              # Authentication pages
│   ├── (browse)/            # Main application pages
│   │   ├── dashboard/       # Stream management dashboard
│   │   └── stream/[streamKey]/ # Stream viewing page
│   └── api/                 # API routes
├── components/              # React components
│   ├── ui/                  # UI components
│   ├── video-player.jsx     # HLS video player
│   └── chat.jsx            # Chat component
├── lib/                     # Utility libraries
│   ├── streaming-server.js  # SRT/HLS streaming logic
│   └── chat-server.js       # WebSocket chat server
└── server.js               # Custom Next.js server
```

## Technology Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Authentication**: Clerk
- **Video Streaming**: FFmpeg, HLS.js
- **Real-time Communication**: Socket.io
- **UI Components**: Radix UI, Lucide React

## Development

### Running in Development Mode

```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Configuration

### Stream Settings

Streams are configured with the following default settings:
- **Video Codec**: H.264 (libx264)
- **Audio Codec**: AAC
- **HLS Segment Duration**: 2 seconds
- **HLS Playlist Size**: 5 segments
- **Preset**: veryfast (for low latency)

### Chat Features

- Real-time messaging
- Typing indicators
- User join/leave notifications
- Viewer count tracking
- Message history (session-based)

## Troubleshooting

### FFmpeg Not Found
Make sure FFmpeg is installed and available in your system PATH:
```bash
ffmpeg -version
```

### Stream Not Starting
1. Check if the port is already in use
2. Verify FFmpeg is working properly
3. Check the server logs for error messages

### Chat Not Working
1. Ensure WebSocket connections are not blocked
2. Check browser console for connection errors
3. Verify Socket.io server is running

### HLS Playback Issues
1. Check if the stream is actively running
2. Verify HLS segments are being generated in `/public/streams/`
3. Try refreshing the page or restarting the stream

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on GitHub or contact the development team.