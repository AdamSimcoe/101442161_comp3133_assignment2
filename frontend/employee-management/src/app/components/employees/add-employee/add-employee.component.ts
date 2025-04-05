// Created by Adam Simcoe - 101442161
// Last Updated - April 2nd, 2025

// Imports
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ADD_EMPLOYEE } from './add-employee.graphql';
import { Apollo } from 'apollo-angular';

// Component Setup
@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css'
})

export class AddEmployeeComponent implements OnInit {
  // Dependency injection
  private http = inject(HttpClient);
  private router = inject(Router);
  private apollo = inject(Apollo);

  // Initialize employee photos list
  photos: String[] = [];

  // Initialize error message list
  errorMessageList: string[] = [];

  // Initialize form
  form: any = {
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    designation: '',
    salary: '',
    date_of_joining: '',
    department: '',
    employee_photo: ''
  };

  // Fetch list of employee photos after component initialization
  ngOnInit(): void {
    this.http.get<String[]>('http://localhost:5000/api/photos')
      .subscribe(data => this.photos = data);
  }

  // submit form method
  onSubmit() {
    // Get salary from form input
    const salaryInput = this.form.salary;
    
    // Parse salary into float
    const parsedSalary = parseFloat(salaryInput);

    // Prepare data payload for mutation
    const payload: any = {
      ...this.form,
      // Set to empty string if not present
      employee_photo: this.form.employee_photo || ''
    };

    // Include salary if its valid and not empty
    if (salaryInput !== '' && !isNaN(parsedSalary)) {
      payload.salary = parsedSalary;
    } else {
      // Prevent GraphQL from receiving null
      // Done in order to prevent GraphQL error from overriding 
      // validation error list 
      delete payload.salary;
    }

    // GraphQL mutation using form payload
    this.apollo.mutate({
      mutation: ADD_EMPLOYEE,
      variables: payload
    }).subscribe({
      // Successful add
      next: () => {
        // Alert user and navigate back to employee list page
        alert('Employee successfully added.');
        this.router.navigate(['/employees']);
      },
      // Failed add
      error: (err) => {
        // Log error
        console.error('Add attempt failed:', err);

        // Extract GraphQL error
        const gqlError = err?.graphQLErrors?.[0];
        
        // Extract Validation Errors
        const validationErrors = gqlError?.extensions?.validationErrors;
        
        // Extract any network Error
        let networkError = err?.networkError?.result?.errors?.[0]?.message || err?.networkError?.message;
        
        // Generic server message in event backend unreachable
        if (networkError === 'Failed to fetch') {
          networkError = 'Unable to connect to server. Please try again later.';
        }

        // Display validation errors if present, otherwise default to GraphQL or network error
        this.errorMessageList = Array.isArray(validationErrors)
          ? validationErrors
          : [gqlError?.message || networkError || 'An unexpected error has occurred.']
      }
    });
  }
}
