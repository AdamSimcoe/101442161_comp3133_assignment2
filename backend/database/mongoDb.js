// Created by Adam Simcoe - 101442161
// Last Updated - April 1st, 2025

const { process_params } = require('express/lib/router');
const { MongoClient } = require('mongodb');
require('dotenv').config();

// Grab MongoDB URI from environment variable
const uri = process.env.MONGO_URI;

if (!uri) {
    console.error('MONGO URI not defined in environment variables.');
    process.exit(1);
}

// Create new MongoClient instance and initialize db
const client = new MongoClient(uri);
let db;

// Connect to the DB
const connectDB = async () => {
    if (db) return db;

    try {
        await client.connect();
        db = client.db(process.env.DB_NAME || '101442161_comp3133_assignment2');
        console.log('Connected to MongoDB successfully!');
        return db;
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        throw err;
    }
};

// Get initialized DB
const getDB = async () => {
    if (!db) {
        await connectDB();
    }
    return db;
};

module.exports = {connectDB, getDB};