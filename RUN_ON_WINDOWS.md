# Running Learnify on Windows

You need: Node.js (LTS), npm, and a PostgreSQL database that already has the Learnify tables.
(The project does not include a SQL schema file, so use your existing database.)

Use 3 separate terminals (PowerShell or CMD). The backend and frontend must use different ports.

## 1) Install (one time)

    cd Learnify
    npm install              :: root (jsonwebtoken)
    cd server
    npm install
    cd ..\client
    npm install

## 2) Backend settings

In `server\` copy `.env.example` to `.env` and fill it:

    PORT=5000
    DATABASE_URL=your_postgresql_connection_string
    JWT_SECRET=any_long_random_text
    FRONTEND_URL=http://localhost:3001

## 3) Frontend settings

In `client\` copy `.env.example` to `.env.local`:

    NEXT_PUBLIC_API_URL=http://localhost:5000/api

## 4) Run

Terminal 1 (backend):

    cd Learnify\server
    npm run dev

Terminal 2 (frontend):

    cd Learnify\client
    npm run dev -- -p 3001

Open: http://localhost:3001

Note: the first run needs internet (Google Fonts are downloaded by Next.js).

## Build check

    cd Learnify\client
    npm run build

## Dark Mode

A round Moon/Sun button (bottom-right corner) switches between Light and Dark.
The choice is remembered in the browser; on first visit it follows your system theme.
