#!/bin/bash

# ScoreSmart LMS Deployment Script for VPS
# Usage: ./deploy.sh

echo "🚀 Starting ScoreSmart LMS Deployment..."

# Configuration
APP_DIR="/var/www/scoresmart-lms"
REPO_URL="https://github.com/SHREYANK007/LMS.git"
NODE_VERSION="18"
PM2_NAME="scoresmart-lms"
PORT=3000

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Update system
print_status "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js if not installed
if ! command -v node &> /dev/null; then
    print_status "Installing Node.js v${NODE_VERSION}..."
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    print_warning "Node.js already installed: $(node -v)"
fi

# Install PM2 globally if not installed
if ! command -v pm2 &> /dev/null; then
    print_status "Installing PM2..."
    sudo npm install -g pm2
else
    print_warning "PM2 already installed"
fi

# Install git if not installed
if ! command -v git &> /dev/null; then
    print_status "Installing Git..."
    sudo apt-get install -y git
else
    print_warning "Git already installed"
fi

# Create app directory if it doesn't exist
if [ ! -d "$APP_DIR" ]; then
    print_status "Creating application directory..."
    sudo mkdir -p $APP_DIR
    sudo chown -R $USER:$USER $APP_DIR
fi

# Navigate to app directory
cd $APP_DIR

# Clone or pull latest code
if [ ! -d ".git" ]; then
    print_status "Cloning repository..."
    git clone $REPO_URL .
else
    print_status "Pulling latest changes..."
    git pull origin main
fi

# Install dependencies
print_status "Installing dependencies..."
npm ci --production=false

# Build the application
print_status "Building Next.js application..."
npm run build

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_warning ".env.local not found. Creating template..."
    cat > .env.local << EOL
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/scoresmart_lms"

# NextAuth
NEXTAUTH_URL="http://your-domain.com"
NEXTAUTH_SECRET="your-secret-key-here"

# Email (SendGrid/Resend)
EMAIL_API_KEY=""
EMAIL_FROM=""

# Stripe (for payments)
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=""

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION=""
AWS_BUCKET_NAME=""

# Pusher (for real-time features)
PUSHER_APP_ID=""
PUSHER_KEY=""
PUSHER_SECRET=""
PUSHER_CLUSTER=""
NEXT_PUBLIC_PUSHER_KEY=""
NEXT_PUBLIC_PUSHER_CLUSTER=""
EOL
    print_warning "Please update .env.local with your actual values!"
fi

# Stop existing PM2 process if running
if pm2 list | grep -q $PM2_NAME; then
    print_status "Stopping existing PM2 process..."
    pm2 stop $PM2_NAME
    pm2 delete $PM2_NAME
fi

# Start application with PM2
print_status "Starting application with PM2..."
pm2 start npm --name $PM2_NAME -- start

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
print_status "Setting up PM2 startup script..."
pm2 startup systemd -u $USER --hp /home/$USER

print_status "Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your configuration"
echo "2. Setup Nginx as reverse proxy (see nginx.conf)"
echo "3. Configure SSL with Let's Encrypt"
echo "4. Setup PostgreSQL database"
echo ""
echo "Useful commands:"
echo "  pm2 list              - View running processes"
echo "  pm2 logs $PM2_NAME    - View application logs"
echo "  pm2 restart $PM2_NAME - Restart application"
echo "  pm2 monit             - Monitor application"