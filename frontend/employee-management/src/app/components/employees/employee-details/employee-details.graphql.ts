// Created by Adam Simcoe - 101442161
// Last Updated - April 1st, 2025

// Imports
import { gql } from 'apollo-angular';

// GraphQL query to get employee based off id
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
            created_at
            updated_at
        }
    }
`;