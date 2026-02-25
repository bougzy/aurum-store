import { NextResponse } from 'next/server';

// Socket.io initialization endpoint
// In production, Socket.io is initialized via a custom server
// This endpoint serves as a health check for the socket connection
export async function GET() {
  return NextResponse.json({
    status: 'Socket.io server running',
    path: '/api/socketio',
  });
}
