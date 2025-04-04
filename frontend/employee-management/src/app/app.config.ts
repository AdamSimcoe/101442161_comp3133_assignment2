// Created by Adam Simcoe - 101442161
// Last Updated - April 3rd, 2025

// Imports
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { routes } from './app.routes';
import { provideGraphQL } from './graphql.config';
import { provideHttpClient } from '@angular/common/http';

// Providers
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideGraphQL, 
    provideHttpClient()
  ]
};
