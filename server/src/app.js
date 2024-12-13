// src/app.js
const express = require('express');
const cors = require('cors');
const database = require('../config/database');

class App {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;

        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    initializeMiddlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    initializeRoutes() {
        // Import and use routes
        const userRoutes = require('./routes/userRoutes');
        const templateRoutes = require('./routes/templateRoutes');

        this.app.use('/api/users', userRoutes);
        this.app.use('/api/templates', templateRoutes);
    }

    initializeErrorHandling() {
        // Global error handler
        this.app.use((err, req, res, next) => {
            console.error(err);
            res.status(500).json({
                message: 'Internal Server Error',
                error: process.env.NODE_ENV === 'production' ? {} : err.message
            });
        });
    }

    async start() {
        try {
            // Run database migration before starting the server
            await database.migrate();

            this.app.listen(this.port, () => {
                console.log(`Server running on port ${this.port}`);
            });
        } catch (error) {
            console.error('Failed to start server:', error);
            process.exit(1);
        }
    }
}

module.exports = new App();