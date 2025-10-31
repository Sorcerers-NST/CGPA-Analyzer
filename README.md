# CGPA Calculator

A modern, full-stack web application for students to track their academic performance, calculate CGPA, and manage semester grades efficiently.

## Features

### Core Functionality
- **CGPA Calculation**: Real-time calculation of cumulative grade point average
- **Semester Management**: Track multiple semesters with courses, credits, and grades
- **Academic Progress**: Visualize your performance across different academic periods
- **Data Export**: Download your academic records as PDF or CSV

### Authentication & Security
- **Email/Password Authentication**: Secure registration and login system
- **Google OAuth 2.0**: Quick sign-in with your Google account
- **JWT-based Sessions**: HTTP-only cookie authentication for enhanced security
- **Profile Management**: Complete your profile with college information

### User Experience
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Clean Interface**: Modern, intuitive UI built with Tailwind CSS
- **Real-time Updates**: Instant feedback on grade calculations
- **Empty States**: Helpful guidance when starting out

### Dashboard Features
- Current CGPA display
- Total semesters tracked
- Credit hours earned
- Courses completed count
- Quick access to add semesters, view reports, and export data

## Tech Stack

### Frontend
- **React 18** - UI library with hooks
- **Vite 7.1.14** - Next-generation frontend build tool
- **React Router DOM v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Node.js** - JavaScript runtime
- **Express 5.1.0** - Web application framework
- **Prisma 6.18.0** - Modern ORM for database management
- **PostgreSQL** - Relational database
- **Passport.js** - Authentication middleware
- **Bcrypt** - Password hashing

### Security & Middleware
- **JWT** - JSON Web Tokens for authentication
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - Parse HTTP cookies
- **Morgan** - HTTP request logger

## 📁 Project Structure

```
CGPA-Analyzer/
├── client/                          # Frontend application
│   ├── public/
│   │   └── assets/                  # Static assets
│   ├── src/
│   │   ├── assets/                  # Images, GIFs, logos
│   │   ├── features/
│   │   │   └── semesters/
│   │   │       └── calculator.js    # CGPA calculation logic
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   │   ├── CompleteProfile.jsx
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Signup.jsx
│   │   │   ├── Dashboard/
│   │   │   │   └── Dashboard.jsx
│   │   │   └── Landing/
│   │   │       ├── Body1.jsx
│   │   │       ├── FooterLanding.jsx
│   │   │       ├── Landing.jsx
│   │   │       └── NavbarLanding.jsx
│   │   ├── App.css
│   │   ├── App.jsx                  # Main app component
│   │   ├── index.css                # Global styles
│   │   └── main.jsx                 # Entry point
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js               # Vite configuration
│
├── server/                          # Backend application
│   ├── prisma/
│   │   ├── migrations/              # Database migrations
│   │   └── schema.prisma            # Database schema
│   ├── src/
│   │   ├── config/
│   │   │   ├── index.js             # App configuration
│   │   │   └── passportGoogle.js    # Google OAuth setup
│   │   ├── controllers/
│   │   │   ├── auth.controller.js   # Authentication logic
│   │   │   ├── college.controller.js
│   │   │   └── user.controller.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js   # JWT verification
│   │   │   └── error.middleware.js
│   │   ├── repositories/
│   │   │   └── semester.repo.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js       # Auth endpoints
│   │   │   ├── college.routes.js
│   │   │   ├── index.js             # Route aggregator
│   │   │   └── user.routes.js
│   │   ├── services/
│   │   │   └── semester.service.js
│   │   ├── tests/
│   │   │   └── test.js
│   │   ├── utils/
│   │   │   ├── generateToken.js     # JWT token generation
│   │   │   ├── logger.js
│   │   │   └── validators/
│   │   │       └── validator.js
│   │   └── server.js                # Express app entry
│   ├── db.config.js                 # Prisma client setup
│   └── package.json
│
├── LICENSE
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v14 or higher)
- **Git**

### Installation

#### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/Sorcerers-NST/CGPA-Analyzer.git
cd CGPA-Analyzer
\`\`\`

#### 2. Backend Setup

\`\`\`bash
cd server
npm install
\`\`\`

Create a \`.env\` file in the \`server\` directory:

\`\`\`env
DATABASE_URL="postgresql://username:password@localhost:5432/cgpa_calculator"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NODE_ENV="development"
CLIENT_URL="http://localhost:5175"
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/api/auth/google/callback"
\`\`\`

**Setup Database:**

\`\`\`bash
npx prisma migrate dev
npx prisma db seed
\`\`\`

**Start Backend Server:**

\`\`\`bash
npm run dev
\`\`\`

The server will run on \`http://localhost:3000\`

#### 3. Frontend Setup

Open a new terminal:

\`\`\`bash
cd client
npm install
\`\`\`

Create a \`.env\` file in the \`client\` directory (optional):

\`\`\`env
VITE_API_URL=http://localhost:3000
\`\`\`

**Start Frontend Development Server:**

\`\`\`bash
npm run dev
\`\`\`

The client will run on \`http://localhost:5175\`

### Quick Start

1. Navigate to \`http://localhost:5175\` in your browser
2. Click **Sign Up** to create an account
3. Select your college during registration
4. Login and start tracking your grades!

## Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User**: Student accounts with authentication details
- **College**: Educational institutions with grading scales
- **Semester**: Academic periods with courses
- **Course**: Individual subjects with grades and credits

Run migrations to set up the database:

\`\`\`bash
cd server
npx prisma migrate dev
\`\`\`

View your database with Prisma Studio:

\`\`\`bash
npx prisma studio
\`\`\`

## Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: \`http://localhost:3000/api/auth/google/callback\`
6. Copy Client ID and Client Secret to your \`.env\` file

### Environment Variables

#### Server (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| \`DATABASE_URL\` | PostgreSQL connection string | Yes |
| \`JWT_SECRET\` | Secret key for JWT signing | Yes |
| \`NODE_ENV\` | Environment (development/production) | Yes |
| \`CLIENT_URL\` | Frontend application URL | Yes |
| \`GOOGLE_CLIENT_ID\` | Google OAuth Client ID | No |
| \`GOOGLE_CLIENT_SECRET\` | Google OAuth Client Secret | No |
| \`GOOGLE_CALLBACK_URL\` | OAuth callback URL | No |

#### Client (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| \`VITE_API_URL\` | Backend API URL | No |

## API Endpoints

### Authentication
- \`POST /api/auth/register\` - Register new user
- \`POST /api/auth/login\` - Login user
- \`POST /api/auth/logout\` - Logout user
- \`GET /api/auth/google\` - Initiate Google OAuth
- \`GET /api/auth/google/callback\` - Google OAuth callback

### User
- \`GET /api/users/me\` - Get current user profile
- \`PATCH /api/users/me/college\` - Update user college

### Colleges
- \`GET /api/colleges\` - List all colleges

## Features in Development

- Semester creation and management
- Course tracking within semesters
- CGPA calculation engine
- Progress reports and analytics
- Data visualization charts
- PDF/CSV export functionality
- Grade prediction tools

## 🛠️ Development

### Build for Production

**Frontend:**
\`\`\`bash
cd client
npm run build
\`\`\`

**Backend:**
\`\`\`bash
cd server
npm start
\`\`\`

### Run Tests

\`\`\`bash
cd server
npm test
\`\`\`

### Code Quality

The project uses ESLint for code quality. Run linting:

\`\`\`bash
cd client
npm run lint
\`\`\`

## Deployment

### Frontend Deployment 

1. Build the frontend: \`npm run build\`
2. Deploy the \`dist\` folder to your hosting service
3. Set environment variable: \`VITE_API_URL=your-backend-url\`

### Backend Deployment

1. Set all required environment variables
2. Run database migrations: \`npx prisma migrate deploy\`
3. Start the server: \`npm start\`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Sorcerers-NST** - [GitHub Profile](https://github.com/Sorcerers-NST)

## Acknowledgments

- React and Vite communities for excellent documentation
- Prisma for the amazing database toolkit
- Tailwind CSS for the utility-first CSS framework
- All contributors who help improve this project

## 🔗 Links

- [Report Bug](https://github.com/Sorcerers-NST/CGPA-Analyzer/issues)
- [Request Feature](https://github.com/Sorcerers-NST/CGPA-Analyzer/issues)

---

Made with ❤️ by NSTstudents, for students
