// Created by Adam Simcoe - 101442161
// Last Updated - April 3rd, 2025

// Imports
import { gql } from 'apollo-angular';

// GraphQL query to get employee based off ID
export const GET_EMPLOYEE_BY_ID = gql`
    query GetEmployeeById($eid: ID!) {
        getEmployeeById(eid: $eid) {
            _id
            first_name
            last_name
            email
            gender
            designation
            salary
            date_of_joining
            department
            employee_photo
        }
    }
`;

// GraphQL mutation to update employee based off ID
export const UPDATE_EMPLOYEE = gql`
    mutation UpdateEmployee(
        $eid: ID!,
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
        updateEmployee(
            eid: $eid,
            first_name: $first_name,
            last_name: $last_name,
            email: $email,
            gender: $gender,
            designation: $designation
            salary: $salary,
            date_of_joining: $date_of_joining,
            department: $department,
            employee_photo:  $employee_photo
        ) {
            _id    
        }    
    }
`;