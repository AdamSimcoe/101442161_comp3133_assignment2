// Created by Adam Simcoe - 101442161
// Last Updated - April 4th, 2025

// Imports
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Route guard to protect authenticated employee pages
export const authGuard: CanActivateFn = () => {
    // Inject AuthService and Router
    const authService = inject(AuthService);
    const router = inject(Router);

    // If user is authenticated allow access to route
    if (authService.isAuthenticated()) {
        return true;
    } else {
        // Redirect unauthenticated users to login ppage
        router.navigate(['/login']);
        return false;
    }
};