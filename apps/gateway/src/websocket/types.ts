// WebSocket Message Types (RPC Protocol)

// Request format from client to gateway
export interface GatewayRequest {
  id: string; // Unique request ID for response matching
  method: string; // RPC method name (e.g., "agent.invoke", "sessions.list")
  params?: unknown; // Method parameters
}

// Response format from gateway to client
export interface GatewayResponse {
  id: string; // Matches request ID
  result?: unknown; // Result data
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

// Event notification (no request/response)
export interface GatewayEvent {
  type: 'message' | 'presence' | 'typing' | 'health_data' | 'agent_event';
  data: unknown;
}

// WebSocket message (union type)
export type WSMessage = GatewayRequest | GatewayResponse | GatewayEvent;

// Client connection info
export interface ClientConnection {
  id: string;
  authenticated: boolean;
  userId?: string;
  connectedAt: Date;
  lastHeartbeat: Date;
}

// Message type guards
export function isGatewayRequest(msg: unknown): msg is GatewayRequest {
  return (
    typeof msg === 'object' &&
    msg !== null &&
    'id' in msg &&
    'method' in msg
  );
}

export function isGatewayResponse(msg: unknown): msg is GatewayResponse {
  return (
    typeof msg === 'object' &&
    msg !== null &&
    'id' in msg &&
    ('result' in msg || 'error' in msg)
  );
}

export function isGatewayEvent(msg: unknown): msg is GatewayEvent {
  return (
    typeof msg === 'object' &&
    msg !== null &&
    'type' in msg &&
    ['message', 'presence', 'typing', 'health_data', 'agent_event'].includes((msg as GatewayEvent).type)
  );
}
