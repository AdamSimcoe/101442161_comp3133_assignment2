// Created by Adam Simcoe - 101442161
// Last Updated - April 1st, 2025

// Imports
import { provideApollo } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';

export function createApollo(): ApolloClientOptions<any> {
    return {
        // GraphQL endpoint URL
        uri: 'http://localhost:5000/graphql',
        cache: new InMemoryCache(),
    };
}

export const provideGraphQL = provideApollo(createApollo);