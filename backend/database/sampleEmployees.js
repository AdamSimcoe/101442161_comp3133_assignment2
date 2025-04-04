// Created by Adam Simcoe - 101442161
// Last Updated - April 1st, 2025

const { getDB } = require('../database/mongoDb');

// Seed Sample Employees if they do not already exist in DB
const setupSampleEmployees = async () => {
    const db = await getDB();

    const sampleEmployees = [
        {
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@gbc.ca',
            gender: 'Male',
            designation: 'Software Engineer',
            salary: 80000,
            date_of_joining: '2024-11-29',
            department: 'Engineering',
            employee_photo: 'http://localhost:5000/assets/employee_photos/employee3.png',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jane.smith@gbc.ca',
            gender: 'Female',
            designation: 'Product Manager',
            salary: 95000,
            date_of_joining: '2024-08-21',
            department: 'Product',
            employee_photo: 'http://localhost:5000/assets/employee_photos/employee2.png',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            first_name: 'Patrick',
            last_name: 'Clark',
            email: 'patrick.clarkn@gbc.ca',
            gender: 'Male',
            designation: 'UX Designer',
            salary: 75000,
            date_of_joining: '2023-06-17',
            department: 'Design',
            employee_photo: 'http://localhost:5000/assets/employee_photos/employee4.png',
            created_at: new Date(),
            updated_at: new Date(),
        }
    ];

    try {
        // Check DB for duplicate sample data
        const existingEmployees = await db.collection('employees').find({
            email: { $in: sampleEmployees.map(employee => employee.email) }
        }).toArray();

        if (existingEmployees.length > 0) {
            console.log('Sample employees have already been added, skipping insertion.');
            return;
        }

        await db.collection('employees').insertMany(sampleEmployees);
        console.log('Sample employee data has been added for testing CRUD operations.');
    } catch (err) {
        console.error('Error inserting sample employee data:', err);
    }
};

module.exports = setupSampleEmployees;