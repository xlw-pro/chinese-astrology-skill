#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { server } from './mcp.js';

try {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log('Chinese Astrology Skill is running on stdio.');
} catch (error) {
  console.error('Failed to start Chinese Astrology Skill on stdio.');
}
