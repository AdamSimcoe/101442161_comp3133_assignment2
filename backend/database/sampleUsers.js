// Created by Adam Simcoe - 101442161
// Last Updated - February 10th, 2025

const { getDB } = require('../database/mongoDb');
const bcrypt = require('bcryptjs');

// Seed Sample Users if they do not already exist in DB
const setupSampleUsers = async () => {
    const db = await getDB();

    const sampleUsers = [
        {
            username: 'testuser1',
            email: 'test1@example.com',
            password: 'password123',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            username: 'testuser2',
            email: 'test2@example.com',
            password: 'password 1234',
            created_at: new Date(),
            updated_at: new Date(),
        }
    ];

    try {
        // Check DB for duplicate sample data
        const existingUsers = await db.collection('users').find({
            $or: [
                {username: 'testuser1', email: 'test1@example.com'},
                {username: 'testuser2', email: 'test2@example.com'}
            ]
        }).toArray();

        if (existingUsers.length === sampleUsers.length) {
            console.log('Sample users have already been added, skipping insertion.');
            return;
        }

        for (let user of sampleUsers) {
            user.password = await bcrypt.hash(user.password,10);
        }

        await db.collection('users').insertMany(sampleUsers);
        console.log('Sample user data has been added for testing login purposes.');
    } catch (err) {
        console.error('Error inserting sample user data:', err);
    }
};

module.exports = setupSampleUsers;