// Created by Adam Simcoe - 101442161
// Last Updated - April 4th, 2025

// Imports
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Apollo } from 'apollo-angular';
import { SIGNUP_USER } from './signup.graphql';

// Component Setup
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})

export class SignupComponent {
  // Initialize form
  form = {
    username: '',
    email: '',
    password: '',
  };

  // Intiallize error ist
  errorMessageList: String[] = [];

  // Constructor injection
  constructor(private apollo: Apollo, private authService: AuthService, private router: Router) {}

  // Signup method
  onSignup() {
    // Reset error List from previous entries
    this.errorMessageList = [];

    // Run signup mutation with username, email and password
    this.apollo.mutate<any>({
      mutation: SIGNUP_USER,
      variables: this.form
    }).subscribe({
      // Successful signup
      next: (result) => {
        const payload = result.data.signup;
        // Store user id in local storage
        this.authService.login(payload.user_id);
        // Redirect to employee list page
        this.router.navigate(['/employees']);
      },
      // Failed signup
      error: (err) => {
        // Extract GraphQL errors
        const gqlError = err?.graphQLErrors?.[0];
        // Extract validation errors from backend
        const validationErrors = gqlError?.extensions?.validationErrors;

        // If validation errors are an array, print the list of errors
        // If not, use GraphQL error or the generic message
        this.errorMessageList = Array.isArray(validationErrors)
          ? validationErrors
          : [gqlError?.message || 'Signup failed. Please try again.'];
      }
    });
  }
}
