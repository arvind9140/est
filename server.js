const cron = require('node-cron');
const axios = require('axios');
const http = require('http');

// API endpoint configuration
const API_URL = 'https://ac-wjs-api-main.mangoforest-291de162.swedencentral.azurecontainerapps.io/api/crm/refresh-tokens';
const REQUEST_DATA = {
  userId: '68e3444c258779e592b4f2c0',
  type: 'crm',
  crmName: 'hubspot'
};

// Function to refresh tokens
async function refreshTokens() {
  try {
    console.log(`[${new Date().toISOString()}] Refreshing tokens...`);
    
    const response = await axios.post(API_URL, REQUEST_DATA, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`[${new Date().toISOString()}] Token refresh successful:`, response.status);
    if (response.data) {
      console.log('Response:', JSON.stringify(response.data));
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error refreshing tokens:`, error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Schedule cron job to run every 10 minutes
// Cron pattern: '*/10 * * * *' means every 10 minutes
const cronJob = cron.schedule('*/10 * * * *', () => {
  refreshTokens();
}, {
  scheduled: true,
  timezone: "UTC"
});

// Run immediately on server start
console.log('Server started. Running initial token refresh...');
refreshTokens();

// Run cron job automatically
console.log('Cron job scheduled to run every 10 minutes.');

// Keep the process alive
process.on('SIGINT', () => {
  console.log('\nShutting down cron job...');
  cronJob.stop();
  if (server) {
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
    return;
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down cron job...');
  cronJob.stop();
  if (server) {
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
    return;
  }
  process.exit(0);
});

// Create a lightweight HTTP server for health checks
const PORT = process.env.PORT || 5000;
const server = http.createServer((req, res) => {
  // Health check: GET /health
  if (req.method === 'GET' && (req.url === '/health' || req.url === '/healthz')) {
    const payload = {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      pid: process.pid
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(payload));
    return;
  }

  // root path - small info
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Refresh tokens cron is running. Use GET /health to check status.' }));
    return;
  }

  // not found
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`Health-check server listening on port ${PORT}`);
});

