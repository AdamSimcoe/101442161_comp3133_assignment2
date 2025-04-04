// Created by Adam Simcoe - 101442161
// Last Updated - April 1st, 2025

// Imports
import { gql } from 'apollo-angular';

// GraphQL add employee mutation
export const ADD_EMPLOYEE = gql`
    mutation AddEmployee(
        $first_name: String!,
        $last_name: String!,
        $email: String!,
        $gender: String!,
        $designation: String!,
        $salary: Float,
        $date_of_joining: String!,
        $department: String!,
        $employee_photo: String
    ) {
        addEmployee(
            first_name: $first_name,
            last_name: $last_name,
            email: $email,
            gender: $gender,
            designation: $designation,
            salary: $salary,
            date_of_joining: $date_of_joining,
            department: $department,
            employee_photo: $employee_photo
        ) {
            _id    
        }   
    }
`;