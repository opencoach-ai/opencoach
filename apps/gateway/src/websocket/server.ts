import { WebSocketServer, WebSocket } from 'ws';
import { isGatewayRequest, GatewayResponse, GatewayEvent } from './types.js';
import { handleRequest } from './handlers.js';

const GATEWAY_PORT = 18789;
const HEARTBEAT_INTERVAL = 30000; // 30 seconds

let wss: WebSocketServer | null = null;

// Start the WebSocket server
export function startGatewayServer(): WebSocketServer {
  if (wss) {
    console.log('Gateway server already running');
    return wss;
  }

  wss = new WebSocketServer({ port: GATEWAY_PORT });

  wss.on('listening', () => {
    console.log(`🚀 Gateway WebSocket server listening on ws://127.0.0.1:${GATEWAY_PORT}`);
  });

  wss.on('connection', (ws: WebSocket) => {
    const clientId = generateClientId();
    console.log(`✅ Client connected: ${clientId}`);

    // Send welcome message
    send(ws, {
      type: 'message',
      data: {
        message: 'ected to OpenCoach Gateway',
        clientId,
        timestamp: new Date().toISOString(),
      },
    } as GatewayEvent);

    // Handle incoming messages
    ws.on('message', async (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        console.log(`📨 Received:`, message);

        // Handle RPC requests
        if (isGatewayRequest(message)) {
          const response = await handleRequest(message, ws);
          send(ws, response);
        }
      } catch (error) {
        console.error('❌ Error handling message:', error);
        send(ws, {
          type: 'message',
          data: {
            error: 'Invalid message format',
          },
        } as GatewayEvent);
      }
    });

    // Handle connection close
    ws.on('close', () => {
      console.log(`❌ Client disconnected: ${clientId}`);
    });

    // Handle errors
    ws.on('error', (error) => {
      console.error(`❌ WebSocket er${clientId}:`, error);
    });

    // Send heartbeat
    const heartbeatInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping();
      } else {
        clearInterval(heartbeatInterval);
      }
    }, HEARTBEAT_INTERVAL);

    // Cleanup on close
    ws.on('close', () => {
      clearInterval(heartbeatInterval);
    });
  });

  // Handle server errors
  wss.on('error', (error) => {
    console.error('❌ Gateway server error:', error);
  });

  return wss;
}

// Stop the WebSocket server
export function stopGatewayServer() {
  if (wss) {
    wss.close();
    wss = null;
    console.log('🛑 Gateway server stopped');
  }
}

// Send message to client
function send(ws: WebSocket, message: GatewayResponse | GatewayEvent) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

// Generate random client ID
function generateClientId(): string {
  return `client_${Date()}_${Math.random().toString(36).substring(2, 9)}`;
}
