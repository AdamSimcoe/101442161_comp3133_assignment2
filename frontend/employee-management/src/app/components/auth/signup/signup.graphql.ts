// Created by Adam Simcoe - 101442161
// Last Updated - April 4th, 2025

// Imports
import { gql } from 'apollo-angular';

// GraphQL signup mutation
export const SIGNUP_USER = gql`
    mutation Signup($username: String!, $email: String!, $password: String!) {
        signup(username: $username, email: $email, password: $password) {
            message
            user_id
        }
    }
`;