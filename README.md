# Form Platform

A full-stack web application that enables users to create, manage, and share forms. Built with React, Express, and MySQL.

## Features

- User Authentication & Authorization
- Multilingual Support (Georgian and English)
- Public and Private Forms
- Form Access Management
- Image Upload Support via Cloudinary
- Cross-Site Scripting (XSS) Protection
- Cross-Site Request Forgery (CSRF) Protection
- SQL Injection Protection
- JWT Authentication (HTTP-only cookie + localStorage)

## Tech Stack

### Frontend

- React
- Redux
- Tailwind CSS
- Ant Design
- i18next (Internationalization)

### Backend

- Node.js
- Express
- MySQL
- Sequelize ORM

### Cloud Services

- Frontend Hosting: render.com
- Backend Hosting: render.com
- Database Hosting: clever-cloud.com
- Image Storage: cloudinary.com
- Server Uptime: cron-job.org

## Live Demo

- Frontend: [https://form-platform-client.onrender.com](https://form-platform-client.onrender.com/)
- Backend: [https://form-platform-server.onrender.com](https://form-platform-server.onrender.com/)

## Getting Started

### Prerequisites

- Node.js
- MySQL
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Luk1e/form-platform.git
cd form-platform
```

2. Frontend Setup:

```bash
cd client
npm install
npm run dev
```

3. Backend Setup:

```bash
cd server
npm install
npm run dev
```

4. Database Configuration:
   - Create a MySQL database
   - Configure environment variables in `.env`:

```env
DEV_DB_USER=your_user
DEV_DB_PASSWORD=your_password
DEV_DB_NAME=your_db_name
DEV_DB_HOST=your_host_name
```

5. Configure URLs for Development:
   - In `client/src/utils/hooks/useAxios.js`: Change the backend URL to your local backend URL
   ```javascript
   // Example:
   // Change from production URL to local URL
   // const BACKEND_URL = 'https://form-platform.onrender.com/'
   const BACKEND_URL: 'http://localhost:5000'  // or your custom backend port
   ```
   - In `server/config/environment.js`: change `export const isDevelopment = false` to true

## Deployment Notes

The application is currently hosted on render.com with the following considerations:

- The server may experience a cold start delay (up to 5 minutes) after periods of inactivity
- To mitigate this, a cron job is set up on cron-job.org to send requests every 5 minutes
- Database connections are limited to a maximum pool of 5 connections

## Performance Optimization

- Server uptime is maintained through automated requests every 5 minutes
- Image assets are optimized and stored on Cloudinary
- Database connections are pooled and managed efficiently

## Security Features

- JWT-based authentication using HTTP-only cookies and localStorage
- Protection against:
  - Cross-Site Scripting (XSS)
  - Cross-Site Request Forgery (CSRF)
  - SQL Injection

## Author

**Luka Gogiashvili**  
Email: luka.gogiashvili.02@gmail.com

## Repository

GitHub: [https://github.com/Luk1e/form-platform.git](https://github.com/Luk1e/form-platform.git)

## License

This project is free to use.
