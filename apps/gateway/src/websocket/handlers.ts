import { WebSocket } from 'ws';
import { GatewayRequest, GatewayResponse } from './types.js';

// Handler registry
type MethodHandler = (params: unknown, connection: WebSocket) =>
Promise<unknown>;

const handlers = new Map<string, MethodHandler>();

// Register a handler for a method
export function registerHandler(method: string, handler: MethodHandler) {
  handlers.set(method, handler);
}

// Handle incoming request
export async function handleRequest(
  request: GatewayRequest,
  connection: WebSocket
): Promise<GatewayResponse> {
  const { id, method, params } = request;

  try {
    const handler = handlers.get(method);

    if (!handler) {
      return {
        id,
        error: {
          code: -32601,
          message: `Method not found: ${method}`,
        },
      };
    }

    const result = await handler(params, connection);

    return {
      id,
      result,
    };
  } catch (error) {
    return {
      id,
      error: {
        code: -32603,
        message: error instanceof Error ? error.message : 'Unknown error',
        data: error,
      },
    };
  }
}

// Built-in handlers for testing
registerHandler('ping', async () => ({
  message: 'pong',
  timestamp: new Date().toISOString(),
}));

registerHandler('echo', async (params) => params);
