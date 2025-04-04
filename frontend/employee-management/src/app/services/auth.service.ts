// Created by Adam Simcoe - 101442161
// Last Updated - April 4th, 2025

// Imports
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    // Track if user is logged in
    private isLoggedIn = new BehaviorSubject<boolean>(this.hasStoredUserid());
    
    // Check if localStorage has user id stored
    private hasStoredUserid(): boolean {
        return !!localStorage.getItem('user_id');
    }

    // Expose isLoggedIn as observable
    isLoggedIn$ = this.isLoggedIn.asObservable();

    // Update login state and store user id in local storage
    login(userId: string) {
        localStorage.setItem('user_id', userId);
        this.isLoggedIn.next(true);  
    }

    // Update login state and remove user id from local storage
    logout() {
        localStorage.removeItem('user_id');
        this.isLoggedIn.next(false);
    }

    // Get user id from local storage
    getUserId(): string | null {
        return localStorage.getItem('user_id');
    }   

    // Check if user id is present in local storage
    isAuthenticated(): boolean {
        return this.getUserId() !== null;
    }
}