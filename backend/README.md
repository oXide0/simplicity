# Announcements API — Backend

REST API for managing announcements, built with Node.js, Express, TypeScript, and SQLite.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation & Running

```bash
cd backend
npm install
npm run seed    # populate database with sample data
npm run dev     # start dev server on http://localhost:4000
```

### Available Scripts

| Script          | Description                                            |
| --------------- | ------------------------------------------------------ |
| `npm run dev`   | Start dev server with hot reload (tsx watch)           |
| `npm run seed`  | Seed database with sample categories and announcements |
| `npm run build` | Compile TypeScript to JavaScript                       |
| `npm start`     | Run compiled JavaScript (production)                   |

## API Endpoints

Base URL: `http://localhost:4000`

### Announcements

| Method | Endpoint                 | Description                                    |
| ------ | ------------------------ | ---------------------------------------------- |
| GET    | `/api/announcements`     | List all announcements (sorted by last update) |
| GET    | `/api/announcements/:id` | Get a single announcement                      |
| POST   | `/api/announcements`     | Create a new announcement                      |
| PUT    | `/api/announcements/:id` | Update an existing announcement                |
| DELETE | `/api/announcements/:id` | Delete an announcement                         |

#### Query Parameters (GET /api/announcements)

| Param      | Type   | Description                   |
| ---------- | ------ | ----------------------------- |
| `category` | number | Filter by category ID         |
| `search`   | string | Text search in title and body |

**Example:** `GET /api/announcements?category=1&search=meeting`

### Categories

| Method | Endpoint          | Description         |
| ------ | ----------------- | ------------------- |
| GET    | `/api/categories` | List all categories |

## Request/Response Examples

### Create Announcement

**POST** `/api/announcements`

```json
{
    "title": "New Feature Release",
    "body": "We are releasing a new feature that improves user experience.",
    "publicationDate": "2025-03-15T10:00:00.000Z",
    "categoryIds": [1, 2]
}
```

**Response (201):**

```json
{
    "data": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "title": "New Feature Release",
        "body": "We are releasing a new feature that improves user experience.",
        "publicationDate": "2025-03-15T10:00:00.000Z",
        "createdAt": "2025-03-15T10:00:00.000Z",
        "updatedAt": "2025-03-15T10:00:00.000Z",
        "categories": [
            { "id": 1, "name": "Company News" },
            { "id": 2, "name": "Engineering" }
        ]
    }
}
```

### Update Announcement

**PUT** `/api/announcements/:id`

```json
{
    "title": "Updated Feature Release",
    "body": "Updated description of the feature release.",
    "publicationDate": "2025-03-16T10:00:00.000Z",
    "categoryIds": [1]
}
```

### Error Response (400)

```json
{
    "error": "Title is required. At least one category is required"
}
```

## Testing with Postman

1. **Import** — Create a new collection in Postman.
2. **List categories** — `GET http://localhost:4000/api/categories` to see available category IDs.
3. **List announcements** — `GET http://localhost:4000/api/announcements`
4. **Search** — `GET http://localhost:4000/api/announcements?search=meeting`
5. **Filter by category** — `GET http://localhost:4000/api/announcements?category=1`
6. **Create** — `POST http://localhost:4000/api/announcements` with JSON body (see example above). Set header `Content-Type: application/json`.
7. **Update** — `PUT http://localhost:4000/api/announcements/{id}` with JSON body.
8. **Delete** — `DELETE http://localhost:4000/api/announcements/{id}` — returns 204 No Content.

## WebSocket (Bonus)

The server broadcasts a Socket.io event when a new announcement is created.

**Event:** `announcement:created`

**Connection:**

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");
socket.on("announcement:created", (payload) => {
    console.log("New announcement:", payload.data);
});
```

The payload contains the full announcement object inside `{ data: Announcement }`.

## Data Model

### Announcements

| Column           | Type            | Description                 |
| ---------------- | --------------- | --------------------------- |
| id               | TEXT (UUID)     | Primary key                 |
| title            | TEXT            | Announcement title          |
| body             | TEXT            | Announcement content        |
| publication_date | TEXT (ISO 8601) | Publication date and time   |
| created_at       | TEXT (ISO 8601) | Record creation timestamp   |
| updated_at       | TEXT (ISO 8601) | Last modification timestamp |

### Categories

| Column | Type    | Description                  |
| ------ | ------- | ---------------------------- |
| id     | INTEGER | Primary key (auto-increment) |
| name   | TEXT    | Category name (unique)       |

### Announcement-Categories (many-to-many)

| Column          | Type    | Description           |
| --------------- | ------- | --------------------- |
| announcement_id | TEXT    | FK → announcements.id |
| category_id     | INTEGER | FK → categories.id    |
