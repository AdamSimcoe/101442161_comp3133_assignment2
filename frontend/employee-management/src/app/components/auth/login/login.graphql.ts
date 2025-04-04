// Created by Adam Simcoe - 101442161
// Last Updated - April 4th, 2025

// Imports
import { gql } from 'apollo-angular';

// GraphQL login query
export const LOGIN_USER = gql`
    query Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            message
            user_id
        }
    }
`;