#!/usr/bin/env node

import { config } from 'dotenv';
import { Command } from 'commander';
import { checkPostgreSQL, checkRedis, checkEnvironment } from './health.js';
import { startGatewayServer } from './websocket/server.js';    

// Load environment variables
config();

const program = new Command();

program
  .name('opencoach')
  .description('OpenCoach CLI - Health Agent Control Plane')
  .version('0.1.0');

program
  .command('doctor')
  .description('Check system health (database, redis, environment)')
  .action(async () => {
    console.log('🔍 OpenCoach Health Check\n');

    // Check PostgreSQL
    const pgOk = await checkPostgreSQL();
    if (pgOk) {
      console.log('✓ PostgreSQL: Connected');
    } else {
      console.log('✗ PostgreSQL: Failed to connect');
    }

    // Check Redis
    const redisOk = await checkRedis();
    if (redisOk) {
      console.log('✓ Redis: Connected');
    } else {
      console.log('✗ Redis: Failed to connect');
    }

    // Check Environment
    const envCheck = checkEnvironment();
    if (envCheck.ok) {
      console.log('✓ Environment: All variables set');
    } else {
      console.log(`✗ Environment: Missing ${envCheck.missing.join(', ')}`);
    }

    // Exit with error code if any check failed
    const allOk = pgOk && redisOk && envCheck.ok;
    process.exit(allOk ? 0 : 1);
  });

program
  .command('gateway')
  .description('Start the WebSocket gateway server')
  .action(async () => {
    console.log('🚀 Starting OpenCoach Gateway...\n');

    // Run health checks first
    const pgOk = await checkPostgreSQL();
    const redisOk = await checkRedis();

    if (!pgOk || !redisOk) {
      console.error('❌ Health check failed. Please run "opencoach doctor" to diagnose.');
      process.exit(1);
    }

    console.log('✅ Health checks passed\n');

    // Start the gateway server
    startGatewayServer();

    // Keep the process running
    console.log('📡 Gateway is running. Press Ctrl+C to stop.\n');
  });

program.parse();