#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Add the credentials from .env file
dotenv.config();

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the typescript-sdk CLI (use ESM version)
const sdkPath = join(__dirname, 'typescript-sdk', 'dist', 'esm', 'cli.js');

// Run the MCP server
const server = spawn('node', [sdkPath, 'server'], {
  env: {
    ...process.env,
    // Add OneNote service settings here
    MCP_SERVER_NAME: 'onenote',
    MCP_SERVER_DESCRIPTION: 'OneNote MCP Server Implementation',
    MCP_SERVER_GRAPH_TENANT_ID: process.env.AZURE_TENANT_ID,
    MCP_SERVER_GRAPH_CLIENT_ID: process.env.AZURE_CLIENT_ID,
    MCP_SERVER_GRAPH_CLIENT_SECRET: process.env.AZURE_CLIENT_SECRET
  },
  stdio: 'inherit'
});

server.on('error', (error) => {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});

console.log('OneNote MCP server running...');

// Handle process termination
process.on('SIGINT', () => {
  server.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  server.kill();
  process.exit(0);
}); 