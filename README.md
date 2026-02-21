# Kodbank - Premium Banking Platform

Kodbank is a secure, modern banking application designed with a **Stateless Protocol** architecture using Node.js, Express, and Aiven MySQL (or local SQLite).

## Features
- **Stateless Authentication**: Uses JWT stored in HTTP-only cookies.
- **Aiven Cloud Integration**: Securely connects to Aiven MySQL for user data and token storage.
- **Premium Design**: Modern UI with sidebar navigation, spending analytics, and transaction tracking.
- **Interactive UX**: "Check Balance" with Reveal animation and Party Popper effects.

## Tech Stack
- **Backend**: Node.js, Express.js, JWT, MySQL/SQLite
- **Frontend**: Vanilla HTML5, CSS3, JavaScript
- **Database**: Aiven MySQL (Cloud) / SQLite (Local)

## How to Run
1. Navigate to the `backend` folder.
2. Install dependencies: `npm install`.
3. Configure your `.env` file with Aiven credentials.
4. Start the server: `node server.js`.
5. Open `http://localhost:5050` in your browser.
