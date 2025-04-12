#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Testing OneNote MCP Server...');

// Start the MCP server
const server = spawn('node', ['onenote-mcp.mjs'], {
  env: {
    ...process.env,
    AZURE_TENANT_ID: 'c36c60a3-2e11-4679-ac91-f45b2f095e29',
    AZURE_CLIENT_ID: '27cee0f7-91cd-4ef0-b11d-5f9df8f5b950',
    AZURE_CLIENT_SECRET: 'f-f8Q~72fjRU~zZhSD8PthSNiTrIFBOrqOS9zddT'
  },
  stdio: ['pipe', 'pipe', 'pipe']
});

// Log server output
server.stdout.on('data', (data) => {
  console.log(`Server stdout: ${data}`);
});

server.stderr.on('data', (data) => {
  console.error(`Server stderr: ${data}`);
});

// Send initialization message
setTimeout(() => {
  console.log('Sending initialization request...');
  const initMessage = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '0.6',
      clientInfo: {
        name: 'test-client',
        version: '1.0.0'
      },
      capabilities: {
        tools: {}
      }
    }
  };
  
  server.stdin.write(JSON.stringify(initMessage) + '\n');
  
  // Wait for response and then send tools/list
  setTimeout(() => {
    console.log('Sending tools/list request...');
    const listToolsMessage = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list'
    };
    
    server.stdin.write(JSON.stringify(listToolsMessage) + '\n');
  }, 1000);
}, 1000);

// Cleanup after test
setTimeout(() => {
  console.log('Test complete, shutting down...');
  server.kill();
  process.exit(0);
}, 5000); 