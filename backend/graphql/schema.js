// Created by Adam Simcoe - 101442161
// Last Updated on February 15th, 2025

//Imports
const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
        created_at: String!
        updated_at: String!
    }

    type Employee {
        _id: ID!
        first_name: String!
        last_name: String!
        email: String!
        gender: String!
        designation: String!
        salary: Float!
        date_of_joining: String!
        department: String!
        employee_photo: String
        created_at: String!
        updated_at: String!
    }
    
    type AuthPayload {
        message: String!
        user_id: ID
    }

    type Query {
        login(email: String!, password: String!): AuthPayload
        getAllEmployees: [Employee]
        getEmployeeById(eid: ID!): Employee
        searchEmployees(designation: String, department: String): [Employee]
    }
    
    type Mutation {
        signup(username: String!, email: String!, password: String!): AuthPayload
        addEmployee(
            first_name: String!,
            last_name: String!,
            email: String!,
            gender: String!,
            designation: String!,
            salary: Float,
            date_of_joining: String!, 
            department: String!, 
            employee_photo: String
        ): Employee
        updateEmployee(
            eid: ID!,
            first_name: String!,
            last_name: String!,
            email: String!,
            gender: String!,
            designation: String!,
            salary: Float,
            date_of_joining: String!,
            department: String!,
            employee_photo: String
        ): Employee
        deleteEmployee(eid: ID!): String
    }
`;

// Exports
module.exports = typeDefs;