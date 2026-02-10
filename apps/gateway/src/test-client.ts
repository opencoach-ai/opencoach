import WebSocket from 'ws';

const GATEWAY_URL = 'ws://127.0.0.1:18789';

console.log('🔌 Connecting to Gateway...');

const ws = new WebSocket(GATEWAY_URL);

ws.on('open', () => {
  console.log('✅ Connected to Gateway!\n');

  // Test 1: Ping
  console.log('📤 Test 1: Sending ping...');
  ws.send(JSON.stringify({
    id: 'test-1',
    method: 'ping',
    params: {}
  }));

  // Wait a bit, then test echo
  setTimeout(() => {
    console.log('\n📤 Test 2: Sending echo...');
    ws.send(JSON.stringify({
      id: 'test-2',
      method: 'echo',
      params: { message: 'Hello OpenCoach!' }
    }));
  }, 1000);

  // Wait a bit, then test unknown method
  setTimeout(() => {
    console.log('\n📤 Test 3: Testing unknown method...');
    ws.send(JSON.stringify({
      id: 'test-3',
      method: 'unknown.method',
      params: {}
    }));
  }, 2000);

  // Close after tests
  setTimeout(() => {
    console.log('\n👋 Tests complete. Closing connection...');
    ws.close();
  }, 3000);
});

ws.on('message', (data: Buffer) => {
  const message = JSON.parse(data.toString());
  console.log('📥 Received:', JSON.stringify(message, null, 2));
});

ws.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

ws.on('close', () => {
  console.log('🔌 Connection closed');
  process.exit(0);
});