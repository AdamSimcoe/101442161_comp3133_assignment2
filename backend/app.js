// Created by Adam Simcoe - 101442161
// Last Updated on February 10th, 2025

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./database/mongoDb');
const setupSampleUsers = require('./database/sampleUsers');
const setupSampleEmployees = require('./database/sampleEmployees');
require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const path = require('path');
const fs = require('fs');

const app = express();

// CORS configuration for requests from front-end
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Initialize DB then run sample users data
connectDB()
    .then(async () => {
        console.log('Database connection established. Setting up sample data.');
        await setupSampleUsers();
        await setupSampleEmployees();
    })
    .catch(err => {
        console.error('Failed to connect to the database.', err);
        process.exit(1);
    });

app.use(express.json());

// Employee photo URL path
app.use('/assets/employee_photos', express.static(path.join(__dirname, 'assets/employee_photos')));

app.get('/api/photos', (req, res) => {
    const photoDir = path.join(__dirname, 'assets/employee_photos');
    fs.readdir(photoDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Could not read photo directory.'});
        }

        const photoList = files.filter(file => file !== 'defaultEmployee.png');
        res.json(photoList);
    });
});


// GraphQL Setup
const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
    await server.start();
    server.applyMiddleware({ app });
}

startServer();

// Set port, default set to 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});