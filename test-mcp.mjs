#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

console.log('Testing OneNote MCP Server...');

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Start the MCP server in a separate process
const server = spawn('node', [join(__dirname, 'onenote-mcp.mjs')], {
  env: {
    ...process.env,
    AZURE_TENANT_ID: 'c36c60a3-2e11-4679-ac91-f45b2f095e29',
    AZURE_CLIENT_ID: '27cee0f7-91cd-4ef0-b11d-5f9df8f5b950',
    AZURE_CLIENT_SECRET: 'f-f8Q~72fjRU~zZhSD8PthSNiTrIFBOrqOS9zddT'
  },
  stdio: 'pipe'
});

// Buffer to collect stdout data
let stdoutBuffer = '';

// Log server output
server.stdout.on('data', (data) => {
  const dataStr = data.toString();
  stdoutBuffer += dataStr;
  console.log(`Server stdout: ${dataStr.trim()}`);
  
  // Try to parse JSON responses
  try {
    const lines = stdoutBuffer.split('\n');
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim();
      if (line) {
        const response = JSON.parse(line);
        console.log('Parsed response:', JSON.stringify(response, null, 2));
      }
    }
    // Keep the last (potentially incomplete) line
    stdoutBuffer = lines[lines.length - 1];
  } catch (e) {
    // Incomplete JSON, will try again with next chunk
  }
});

server.stderr.on('data', (data) => {
  console.error(`Server stderr: ${data.toString().trim()}`);
});

server.on('error', (error) => {
  console.error(`Server process error: ${error.message}`);
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

// Test the MCP server
async function runTest() {
  try {
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
    
    // Wait a bit and then try to list tools
    setTimeout(() => {
      console.log('Sending tools/list request...');
      const listToolsMessage = {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list'
      };
      
      server.stdin.write(JSON.stringify(listToolsMessage) + '\n');
      
      // Clean up after a few seconds
      setTimeout(() => {
        console.log('Test complete, shutting down...');
        server.kill();
        process.exit(0);
      }, 3000);
    }, 1000);
  } catch (error) {
    console.error('Test error:', error);
    server.kill();
    process.exit(1);
  }
}

// Start the test
runTest(); 