// Created by Adam Simcoe - 101442161
// Last Updated on April 3rd, 2025

// Imports
const { getDB } = require('../database/mongoDb');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');
const { validateEmployeeData, validateSignupData } = require('../utils/validation');

// Utility func to help convert date fields to ISO string for GraphQL
function formatEmployee(employee) {

    // Check if created_at and updated_at fields are dtae objects, if not convert them
    const createdAtFormat = employee.created_at instanceof Date ? employee.created_at : new Date(employee.created_at);
    const updatedAtFormat = employee.updated_at instanceof Date ? employee.updated_at : new Date(employee.updated_at);

    // Return employee object with dates converted into ISO string format for graphQL
    return {
        ...employee,
        created_at: createdAtFormat.toISOString(),
        updated_at: updatedAtFormat.toISOString(),
    };
}

// Utility func to check employee_photo path 
function checkEmployeePhoto(photoPath) {
    
    // Path to employee_photos folder
    const assetsPath = path.join(__dirname, '../assets/employee_photos');

    // If employee_photo is empty set to default image
    if (!photoPath) {
        return 'http://localhost:5000/assets/employee_photos/defaultEmployee.png';
    }

    // Extract file name from url path
    const fileName = path.basename(photoPath);
    const imageFullPath = path.join(assetsPath, fileName);

    // Check to see if the image file name exists or not in the folder
    if (fs.existsSync(imageFullPath)) {
        // Return path if it exists
        return `http://localhost:5000/assets/employee_photos/${fileName}`;
    } else {
        // Return the default if it does not exist
        return 'http://localhost:5000/assets/employee_photos/defaultEmployee.png';
    }
}

// GraphQL Resolvers
const resolvers = {

    // Query Operations
    Query: {

        // User login
        async login(_, {email, password}) {

            // DB connection
            const db = await getDB();

            // Find user by email
            const user = await db.collection('users').findOne({email});

            // Check if user is not found
            if (!user) {
                throw new Error('Invalid email or password.');
            }

            // Compare user entry with saved password
            const validPassword = await bcrypt.compare(password, user.password);

            // Invalid password check
            if (!validPassword) {
                throw new Error('Incorrect password.');
            }

            // Return success message and the user's id
            return {message: 'Login successful.', user_id: user._id};
        },

        // Get all employees
        async getAllEmployees() {

            // DB connection
            const db = await getDB();

            // Get all employees from the db and store in an array
            const employees = await db.collection('employees').find().toArray();

            // Return all employees after formatting date fields
            return employees.map(formatEmployee);
        },

        // Get employee by ID
        async getEmployeeById(_, {eid}) {

            // DB connection
            const db = await getDB();

            // Get the employee with the matching ID
            const employee = await db.collection('employees').findOne({_id: ObjectId.createFromHexString(eid)});

            // Check if matching employee not found
            if (!employee) {
                throw new Error('Employee could not be found.');
            }

            // Return specific employee after formatting date fields
            return formatEmployee(employee);
        },

        // Search employees by department and/or designation
        async searchEmployees(_, {designation, department}) {

            // DB connection
            const db = await getDB();

            // Init empty query
            const query = {};

            // Search If designation provided
            if (designation) {
                query.designation = {$regex: designation, $options: 'i'};
            }

            // Search if department provided
            if (department) {
                query.department = {$regex: department, $options: 'i'};
            }

            // Store all employees that match search in array
            const employees = await db.collection('employees').find(query).toArray();

            // Return matched employees after formatting date fields
            return employees.map(formatEmployee);
        },
    },

    // Mutation Operations
    Mutation: {

        // User Signup
        async signup(_, {username, email, password}) {

            // DB connection
            const db = await getDB();

            // Validate fields and ensure none are empty
            validateSignupData({ username, email, password });

            // Check if email already tied to existing user
            const existingUser = await db.collection('users').findOne({email});

            // error for existing user 
            if (existingUser) {
                throw new Error('User with this email already exists.');
            }

            // Hash user's password
            const hashPassword = await bcrypt.hash(password, 10);

            // Insert new user into db
            const result = await db.collection('users').insertOne({
                username,
                email,
                password: hashPassword,
                created_at: new Date(),
                updated_at: new Date(),
            });

            // Return success message and user's id
            return {message: 'User was created successfully.', user_id: result.insertedId}
        },

        // Add Employee
        async addEmployee(_, args) {

            // DB connection
            const db = await getDB();

            // Validate employee fields
            validateEmployeeData(args);

            // Set to current date
            const createdAt = new Date();
            const updatedAt = new Date();

            // Check if employee photo path is valid
            const employeePhoto = checkEmployeePhoto(args.employee_photo);

            // Insert new employee into db
            const result = await db.collection('employees').insertOne({
                ...args,
                employee_photo: employeePhoto,
                created_at: createdAt,
                updated_at: updatedAt,
            });

            // Create new employee object
            const employee = {
                ...args,
                 _id: result.insertedId,
                 employee_photo: employeePhoto,
                 // Convert Date objects to ISO string
                created_at: createdAt.toISOString(),
                updated_at: updatedAt.toISOString(),
            };

            // Return created employee
            return employee;
        },

        // Update Employeee by ID
        async updateEmployee(_, {eid, ...updateData}) {
            
            // DB connection
            const db = await getDB();

            // Validate employee fields
            validateEmployeeData(updateData);

            // Set to current date
            const updatedAt = new Date();

            // Check if employee photo path is valid if employee_photo is being updated
            if (updateData.employee_photo !== undefined) {
                updateData.employee_photo = checkEmployeePhoto(updateData.employee_photo);
            }
            
            // Update specified employee in the DB
            const result = await db.collection('employees').updateOne(
                {_id: ObjectId.createFromHexString(eid)},
                {$set: {...updateData, updated_at: updatedAt}}
            );

            // If no matching employee found
            if (result.matchedCount === 0) {
                throw new Error('Employee was not found.');
            }

            // Store updated employee 
            const employee = await db.collection('employees').findOne({_id: ObjectId.createFromHexString(eid)});

            // Return updated employee with formatted date fields
            return formatEmployee(employee);
        },

        // Delete Employee by ID
        async deleteEmployee(_, {eid}) {

            // DB connection
            const db = await getDB();
            
            // Deleted specified employee in the DB
            const result = await db.collection('employees').deleteOne({_id: ObjectId.createFromHexString(eid)});

            // If no matching employee found
            if (result.deletedCount === 0) {
                throw new Error('Employee was not found.');
            }

            // Return success message
            return 'Employee was deleted successfully.';
        }
    }
};

// Exports
module.exports = resolvers;