// Created by Adam Simcoe - 101442161
// Last Updated - April 1st, 2025

// Imports
import { gql } from "apollo-angular";

// GraphQL query to get all employees
export const GET_ALL_EMPLOYEES = gql`
    query GetAllEmployees {
        getAllEmployees {
            _id
            first_name
            last_name
            department
            designation
        }
    }
`;

// GraphQL query to search employees by designation and/or department
export const SEARCH_EMPLOYEES = gql`
    query SearchEmployees($department: String, $designation: String) {
        searchEmployees(department: $department, designation: $designation) {
            _id
            first_name
            last_name
            department
            designation
        }
    }
`;

// GraphQL mutation to delete employee based off ID
export const DELETE_EMPLOYEE = gql`
    mutation DeleteEmployee($eid: ID!) {
        deleteEmployee(eid: $eid)
    }
`;