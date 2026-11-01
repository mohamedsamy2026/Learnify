# Learnify

**Learnify** is a full-stack e-learning platform designed to make online education more accessible, organized, and engaging.

The platform provides a modern learning environment where students can explore courses, access educational content, and manage their learning journey through an intuitive and responsive interface.

## Features

- **Course Discovery:** Browse available courses and explore their details.
- **Course Details:** View course descriptions, learning materials, and related information.
- **Educational Content:** Support for structured course lessons and video-based learning.
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices.
- **RESTful API:** Backend services for managing application data.
- **Database Integration:** PostgreSQL for structured and persistent data storage.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js, React, JavaScript |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Version Control | Git, GitHub |

## Project Structure

```text
Learnify/
├── client/              # Frontend application
├── server/              # Backend application
├── package.json         # Root dependencies and scripts
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js
- npm
- PostgreSQL
- Git

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/M7mad7amdan/Learnify.git
cd Learnify
```

**2. Install backend dependencies**

```bash
npm install
```

**3. Install frontend dependencies**

```bash
cd client
npm install
```

**4. Configure environment variables**

Create the required environment files for the frontend and backend, based on your local configuration.

For example, the backend may require a PostgreSQL connection string:

```env
DATABASE_URL=your_postgresql_connection_string
```

Do not commit real credentials or environment files to GitHub.

**5. Run the backend**

From the project root:

```bash
npm run dev
```

**6. Run the frontend**

In a separate terminal:

```bash
cd client
npm run dev
```

Open:

```text
http://localhost:3000
```

## Project Goals

Learnify aims to:

- Simplify access to online learning resources.
- Deliver a clean and user-friendly experience.
- Provide an organized platform for educational content.
- Build a scalable foundation for future educational features.

## Future Improvements

- Student and instructor dashboards.
- Course enrollment and progress tracking.
- Quizzes and assessments.
- Certificates of completion.
- Advanced course search and filtering.

## Contributors

Developed as a collaborative full-stack web development project.

## License

This project is intended for educational and portfolio purposes. No license has been specified.

---

**Learnify — Learn smarter, grow further.**
