# URL Shortener

A simple and efficient URL shortener service built with Node.js, Express, and PostgreSQL.

## Installation

```bash
npm install
```

## Setup

1. Create a `.env` file in the root directory with your database credentials:
```
DATABASE_URL=your_postgresql_connection_string
PORT=5000
```

2. Initialize the database:
```bash
npm run init-db
```

## Running the Application

```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Features

- **Create Short Links** - Convert long URLs into short, shareable links
- **Custom Short Codes** - Optionally provide your own custom short code (e.g., "docs", "promo2024")
- **Click Tracking** - Track total clicks and last clicked timestamp for each link
- **Analytics Dashboard** - View all your links with statistics in one place
- **Link Statistics** - Detailed stats page for each short link with click charts
- **Auto-redirect** - Visiting `/{shortcode}` automatically redirects to the original URL (HTTP 302)
- **IST Timezone** - All timestamps displayed in Indian Standard Time (UTC+5:30)

## How It Works

1. **Dashboard** (`/`) - Main interface to create and manage links
   - Enter a long URL
   - Optionally provide a custom short code (3-20 characters)
   - View all your links with click counts and timestamps
   - Copy, view stats, or delete links

2. **Create Link** - Submit a URL to get a short link
   - Auto-generates a random 6-character code if no custom code provided
   - Validates URL format before saving
   - Custom codes must be unique globally

3. **Redirect** (`/{shortcode}`) - Visit the short link
   - Performs HTTP 302 redirect to original URL
   - Increments click counter
   - Updates "last clicked" timestamp

4. **Statistics** (`/stats/{shortcode}`) - View detailed analytics
   - Total clicks
   - Creation date
   - Last clicked time
   - Click trends chart

## API Endpoints

- `POST /api/shorten` - Create a new short link
- `GET /api/links` - Get all links
- `GET /api/links/:shortCode` - Get specific link details
- `DELETE /api/:shortCode` - Delete a link
- `GET /:shortCode` - Redirect to original URL

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Frontend**: Vanilla JavaScript, HTML, CSS
- **Charts**: Chart.js
