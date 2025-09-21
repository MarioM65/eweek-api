# Eweek API

This is the backend API for the Eweek application, built with Node.js, Fastify, and TypeScript. It uses Prisma as an ORM for database interactions and handles various functionalities including user authentication, managing accidents, chats, emergency contacts, entities, branches, items, notifications, payments, partners, insurance companies, and more.

## Technologies Used

*   **Node.js**
*   **Express.js** (Web Framework)
*   **TypeScript**
*   **Prisma ORM** (Database Toolkit)
*   **PostgreSQL** (Likely, given Prisma setup)
*   **bcrypt** (Password Hashing)
*   **jsonwebtoken** (Authentication)
*   **Nodemailer** (Email services)
*   **CORS** (Cross-Origin Resource Sharing)

## Getting Started

### Prerequisites

*   Node.js (v14 or higher recommended)
*   npm or yarn
*   PostgreSQL database

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd eweek-api
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or yarn install
    ```
3.  Set up your environment variables. Create a `.env` file in the root directory and add your database connection string and other necessary configurations (e.g., `DATABASE_URL`, `JWT_SECRET`, email credentials).

4.  Run Prisma migrations to set up your database schema:
    ```bash
    npx prisma migrate dev --name init
    ```
    (Note: The `init` name might need to be adjusted based on existing migrations, or you can use `npx prisma migrate deploy` if migrations are already defined.)

5.  Seed the database (optional):
    ```bash
    npx prisma db seed
    ```

### Running the Application

*   **Development Mode:**
    ```bash
    npm run dev
    ```
    This will start the server with `ts-node-dev`, which automatically restarts on file changes.

*   **Build and Start (Production):**
    ```bash
    npm run build
    npm start
    ```

## Project Structure

*   `src/controllers`: Contains the logic for handling requests and interacting with services/models.
*   `src/models`: Defines the data structures and interacts with the database (via Prisma).
*   `src/routes`: Defines the API endpoints and links them to the respective controllers.
*   `src/utils`: Utility functions (e.g., hashing, mailing).
*   `prisma`: Prisma schema and migrations.
*   `plugins`: Custom plugins (e.g., Prisma client initialization).

## API Endpoints

(This section will be populated with detailed route information in a separate file as requested.)
