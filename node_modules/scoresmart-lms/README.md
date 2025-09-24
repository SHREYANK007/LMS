# ScoreSmart LMS

A comprehensive Learning Management System for PTE and NAATI test preparation with separate portals for Admin, Tutors, and Students.

## Features

### Admin Portal
- Student and Tutor management
- Course and session oversight
- Payment tracking
- Analytics dashboard
- System configuration

### Tutor Portal
- Schedule management
- Material uploads
- Student progress tracking
- Earnings reports

### Student Portal
- Smart Quad (4-student group sessions)
- One-to-One tutoring
- Masterclass sessions
- Study materials
- Progress tracking
- Payment history

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Authentication**: TBD (Backend implementation pending)
- **Database**: TBD (Backend implementation pending)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/SHREYANK007/LMS.git

# Navigate to project directory
cd LMS

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Credentials

- **Admin**: admin@scoresmart.com
- **Tutor**: tutor@scoresmart.com
- **Student**: student@scoresmart.com

*Note: Currently using mock authentication. Backend implementation in progress.*

## Project Structure

```
src/
├── app/
│   ├── admin/     # Admin portal pages
│   ├── tutor/     # Tutor portal pages
│   ├── student/   # Student portal pages
│   └── auth/      # Authentication pages
├── components/    # Reusable components
├── data/         # Mock data
├── lib/          # Utility functions
└── types/        # TypeScript interfaces
```

## Roadmap

- [ ] Backend API development
- [ ] Database integration (PostgreSQL/Prisma)
- [ ] Authentication system (NextAuth.js)
- [ ] Payment integration (Stripe)
- [ ] Real-time features
- [ ] Email notifications
- [ ] File upload system
- [ ] Video streaming for sessions

## License

MIT

## Contact

For any inquiries, please contact: shreyanknath61@gmail.com