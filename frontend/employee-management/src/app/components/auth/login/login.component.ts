// Created by Adam Simcoe - 101442161
// Last Updated - April 4th, 2025

// Imports
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LOGIN_USER } from './login.graphql';
import { Apollo } from 'apollo-angular';

// Component Setup
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  
  // Form fields initialization
  form = {
    email: '',
    password: ''
  };

  // Error message initialization
  errorMessage = '';

  // Constructor injection
  constructor(private apollo: Apollo, private authService: AuthService, private router: Router) {}

  // Login method
  onLogin() {
    // Run login query with email and password variables
    this.apollo.watchQuery<any>({
      query: LOGIN_USER,
      variables: this.form
    }).valueChanges.subscribe({
      // Successful login
      next: (result) => {
        const payload = result.data.login;
        // Store user ID in local storage via AuthService
        this.authService.login(payload.user_id);
        // Redirect to employees list page
        this.router.navigate(['/employees']);
      },
      // Failed login
      error: (err) => {
        // Set error message and display to user
        this.errorMessage = err?.message || 'Login failed. Please try again.';
      }
    });
  }
}
