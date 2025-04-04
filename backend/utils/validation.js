// Created by Adam Simcoe - 101442161
// Last Updated - April 3rd, 2025

// Imports
const { GraphQLError } = require('graphql');

// Set field names to user-friendly displays
const fieldDisplayNames = {
    first_name: 'First Name',
    last_name: 'Last Name',
    email: 'Email',
    gender: 'Gender',
    designation: 'Designation',
    salary: 'Salary',
    date_of_joining: 'Date of Joining',
    department: 'Department',
    username: 'Username',
    password: 'Password'
};

// Return user friendly name for field 
const getDisplayName = (field) => fieldDisplayNames[field] || field;

// Validate email format
const isValidEmail = (email) => 
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Validate gender input
const isValidGender = (gender) => 
    ['Male', 'Female', 'Other'].includes(gender);

// Validate salary is positive number
const isValidSalary = (salary) => 
    !isNaN(salary) && salary >= 0;

// Validate required fields
function validateRequiredFields(data, requiredFields) {
    // Initialize error list
    const errors = [];

    // Loop through fields
    for (const field of requiredFields) {
        const value = data[field];

        // If field value is missing, add validation error to list
        if (value === undefined || value === null || value.toString().trim() === '') {
            errors.push(`${getDisplayName(field)} is required and cannot be empty.`);
        }
    }

    // Return error list
    return errors;
}

// Validate employee data function
function validateEmployeeData(data) {
    // Check if any required fields are missing
    const errors = validateRequiredFields(data, [
        'first_name', 'last_name', 'email', 'gender',
        'designation', 'salary', 'date_of_joining', 'department'
    ]);

    // Check if email exists but is invalid
    if (data.email && !isValidEmail(data.email)) {
        errors.push('Invalid email format.');
    }

    // Check if gender exists but is invalid
    if (data.gender && !isValidGender(data.gender)) {
        errors.push('Gender must be Male, Female, or Other.');
    }

    //  Check if salary exists but is invalid
    if (data.salary && !isValidSalary(data.salary)) {
        errors.push('Salary must be a valid positive number.');
    } 

    // If error list isn't empty
    if (errors.length > 0) {
        // Throw GraphQL validation error
        throw new GraphQLError('Validation Failed', {
            extensions: {
                code: 'BAD_USER_INPUT',
                validationErrors: errors
            }
        });
    }
}

// Validate signup data
function validateSignupData(data) {
    // Check if any required fields are missing
    const errors = validateRequiredFields(data, ['username', 'email', 'password']);

    // Check if email exists but is invalid
    if (data.email && !isValidEmail(data.email)) {
        errors.push('Invalid email format.');
    }

    // If error list isn't empty
    if (errors.length > 0) {
        // Throw GraphQL validation error
        throw new GraphQLError('Validation failed', {
            extensions: {
                code: 'BAD_USER_INPUT',
                validationErrors: errors
            }
        });
    }
}

// Export functions to be used in resolvers.js
module.exports = {
    validateEmployeeData,
    validateSignupData
};
