# ScoreSmart LMS - VPS Deployment Guide

## 📋 Prerequisites

Before deploying, ensure your Hostinger VPS has:
- Ubuntu 20.04+ or Debian 11+
- At least 2GB RAM
- 20GB+ storage
- Root or sudo access
- Domain name pointed to your VPS IP

## 🚀 Deployment Methods

### Method 1: Quick Deploy with Script (Recommended)

1. **Connect to your VPS:**
```bash
ssh root@your-vps-ip
```

2. **Download and run deployment script:**
```bash
# Download the deployment script
wget https://raw.githubusercontent.com/SHREYANK007/LMS/main/deploy.sh

# Make it executable
chmod +x deploy.sh

# Run the deployment
./deploy.sh
```

### Method 2: Manual Deployment

1. **Connect to VPS and update system:**
```bash
ssh root@your-vps-ip
sudo apt update && sudo apt upgrade -y
```

2. **Install Node.js 18:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Install required packages:**
```bash
# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Git
sudo apt install git -y
```

4. **Clone the repository:**
```bash
cd /var/www
git clone https://github.com/SHREYANK007/LMS.git scoresmart-lms
cd scoresmart-lms
```

5. **Install dependencies and build:**
```bash
npm install
npm run build
```

6. **Set up environment variables:**
```bash
cp .env.example .env.local
nano .env.local  # Edit with your configuration
```

7. **Start with PM2:**
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### Method 3: Docker Deployment

1. **Install Docker and Docker Compose:**
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

2. **Clone and deploy:**
```bash
git clone https://github.com/SHREYANK007/LMS.git
cd LMS
docker-compose up -d
```

## 🔧 Configuration

### 1. Database Setup

```bash
# Access PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE scoresmart_lms;
CREATE USER lms_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE scoresmart_lms TO lms_user;
\q
```

### 2. Nginx Configuration

```bash
# Copy nginx config
sudo cp nginx.conf /etc/nginx/sites-available/scoresmart-lms

# Create symlink
sudo ln -s /etc/nginx/sites-available/scoresmart-lms /etc/nginx/sites-enabled/

# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx
```

### 3. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 4. Environment Variables

Create `.env.local` file with:

```env
# Application
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# Database
DATABASE_URL=postgresql://lms_user:password@localhost:5432/scoresmart_lms

# Email (Choose one)
# SendGrid
SENDGRID_API_KEY=your-sendgrid-key
# OR Resend
RESEND_API_KEY=your-resend-key

EMAIL_FROM=noreply@your-domain.com

# File Upload (Optional)
# AWS S3
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
AWS_BUCKET_NAME=scoresmart-uploads

# Payment (Stripe)
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_xxx
```

## 📊 Monitoring

### Check Application Status

```bash
# PM2 status
pm2 status
pm2 logs scoresmart-lms

# System resources
pm2 monit

# Nginx logs
tail -f /var/log/nginx/scoresmart-lms-access.log
tail -f /var/log/nginx/scoresmart-lms-error.log
```

### Health Checks

```bash
# Check if app is running
curl http://localhost:3000/api/health

# Check Nginx
systemctl status nginx

# Check PostgreSQL
systemctl status postgresql
```

## 🔄 Updates

### Update Application

```bash
cd /var/www/scoresmart-lms
git pull origin main
npm install
npm run build
pm2 restart scoresmart-lms
```

### Automated Updates with PM2

```bash
pm2 deploy ecosystem.config.js production
```

## 🛡️ Security

1. **Firewall Setup:**
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

2. **Secure PostgreSQL:**
```bash
# Edit postgresql.conf
sudo nano /etc/postgresql/*/main/postgresql.conf
# Set: listen_addresses = 'localhost'

# Edit pg_hba.conf
sudo nano /etc/postgresql/*/main/pg_hba.conf
# Use md5 authentication
```

3. **Regular Updates:**
```bash
# Create update script
sudo crontab -e
# Add: 0 2 * * 0 apt update && apt upgrade -y
```

## 🆘 Troubleshooting

### Application won't start
```bash
# Check logs
pm2 logs scoresmart-lms --lines 100

# Check port availability
sudo lsof -i :3000

# Rebuild
npm run build
pm2 restart scoresmart-lms
```

### Database connection issues
```bash
# Test connection
psql -U lms_user -d scoresmart_lms -h localhost

# Check PostgreSQL status
systemctl status postgresql

# View PostgreSQL logs
sudo tail -f /var/log/postgresql/*.log
```

### Nginx errors
```bash
# Test configuration
sudo nginx -t

# View error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

## 📞 Support

For deployment issues:
- GitHub Issues: https://github.com/SHREYANK007/LMS/issues
- Email: shreyanknath61@gmail.com

## 🎯 Performance Optimization

1. **Enable Gzip compression** (already in nginx.conf)
2. **Set up CDN** (Cloudflare recommended)
3. **Enable Redis caching** (optional)
4. **Use PM2 cluster mode** (already configured)

## ✅ Post-Deployment Checklist

- [ ] Application accessible via domain
- [ ] SSL certificate installed
- [ ] Database connected
- [ ] Email service configured
- [ ] File uploads working
- [ ] Payment gateway connected
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Firewall enabled
- [ ] Regular updates scheduled