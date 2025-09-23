// PM2 Configuration File
// Usage: pm2 start ecosystem.config.js --env production

module.exports = {
  apps: [
    {
      name: 'scoresmart-lms',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 'max', // Use all CPU cores
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      time: true,
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,

      // Monitoring
      monitoring: true,

      // Advanced features
      post_update: ['npm install', 'npm run build'],

      // Graceful shutdown
      shutdown_with_message: true,

      // Health check
      health_check: {
        interval: 30,
        timeout: 5
      }
    }
  ],

  // Deployment Configuration
  deploy: {
    production: {
      user: 'your-username',
      host: 'your-vps-ip',
      ref: 'origin/main',
      repo: 'https://github.com/SHREYANK007/LMS.git',
      path: '/var/www/scoresmart-lms',
      'pre-deploy': 'git fetch --all',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      env: {
        NODE_ENV: 'production'
      }
    }
  }
};