# Refresh Tokens Cron Job

This Node.js application runs a cron job that refreshes CRM tokens every 10 minutes.

## Installation

Install dependencies:
```bash
npm install
```

## Usage

Start the server:
```bash
npm start
```

The cron job will:
- Run immediately when the server starts
- Execute every 10 minutes automatically
- Make a POST request to the configured API endpoint

## Configuration

Edit `server.js` to modify:
- API URL
- Request data (userId, type, crmName)
- Cron schedule (currently set to every 10 minutes)

## Dependencies

- `node-cron`: For scheduling cron jobs
- `axios`: For making HTTP requests

