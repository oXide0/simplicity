# Announcements Management App

A fullstack application for managing announcements, built with React + Vite (frontend) and Node.js + Express + SQLite (backend).

## Project Structure

- `/backend` — Node.js + Express + TypeScript REST API with SQLite database and Socket.io
- `/frontend` — React + Vite + TypeScript client application

## Quick Start

### Backend

```bash
cd backend
```

Create a `.env` file:

```env
DATABASE_URL="file:./dev.db"
```

Then run:

```bash
npm install
npm run seed    # populate database with sample data
npm run dev     # start dev server on http://localhost:4000
```

### Frontend

```bash
cd frontend
```

Create a `.env` file:

```env
VITE_BASE_URL=http://localhost:4000/api
```

Then run:

```bash
npm install
npm run dev     # start dev server on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
