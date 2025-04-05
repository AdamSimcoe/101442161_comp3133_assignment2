// Created by Adam Simcoe - 101442161
// Last Updated - April 3rd, 2025

// Imports
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { GET_EMPLOYEE_BY_ID, UPDATE_EMPLOYEE } from './update-employee.graphql';
import { HttpClient } from '@angular/common/http';
import { Apollo } from 'apollo-angular';

// Component Setup
@Component({
  selector: 'app-update-employee',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './update-employee.component.html',
  styleUrl: './update-employee.component.css'
})

export class UpdateEmployeeComponent implements OnInit, OnDestroy {
  // Dependency Injection
  private http = inject(HttpClient);
  private apollo = inject(Apollo);
  private router = inject (Router);
  private route = inject(ActivatedRoute);

  // Initialize employee id
  employeeId: string = '';

  // Initialize employee photo list
  photos: string[] = [];

  // Initialize error message list
  errorMessageList: string[] = [];

  // Set boolean to track if employee data is loaded
  isLoading = true;

  // Initialize timeout id
  timeoutId: any = null;

  //Initialize retry interval
  retryInterval: any = null;

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

  // Run once component initialized
  ngOnInit(): void {
    // Set employee id using route param
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';

    // Initialize query retry counter;
    let retries = 0;

    // Timeout redirect for if employee data can not be fetched within 15 seconds
    this.timeoutId = setTimeout(() => {
      if (!this.form.first_name) {
        alert('Employee data could not be loaded in time. Redirecting to employee list.');
        this.router.navigate(['/employees']);
      }
    }, 15000);

    // Get all employee photos from backend
    this.http.get<string[]>('http://localhost:5000/api/photos').subscribe(photoList => {
      this.photos = photoList;

      // Set retry interval to continue attempting query
      this.retryInterval = setInterval(() => {
        // Run GraphQL query to get all employee details using ID
        this.apollo.watchQuery<any>({
          query: GET_EMPLOYEE_BY_ID,
          variables: { eid: this.employeeId },
          fetchPolicy: 'network-only'
        }).valueChanges.subscribe({
          next: (result) => {
            // Set employee data from query  
            const employee = result.data.getEmployeeById;

            if (employee) {
              // Extract photo file name from image url
              const photoUrl = employee.employee_photo || '';
              const fileName = photoUrl ? photoUrl.split('/').pop() : '';

              // Pre-populate form with employee's original data
              this.form = { 
                ...employee,
                employee_photo: fileName 
              };
              // Hide loading display
              this.isLoading = false;

              // Clear timeout and retry interval if data fetched
              clearTimeout(this.timeoutId);
              clearInterval(this.retryInterval);
            }
          }
        });
      // Retry query every 1s
      }, 1000);
    });
  }

   // Clear timeout if user leaves before automatic redirect
   ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      clearInterval(this.retryInterval);
    }
  }

  // Submit form method
  onSubmit() {
    // Parse salary input as float
    const parsedSalary = parseFloat(this.form.salary);

    // Set employee data payload
    const payload: any = {
      ...this.form,
      eid: this.employeeId,
      // Default to empty string if missing
      employee_photo: this.form.employee_photo || ''
    };

    // If not valid number, do not include salary in payload
    if (!isNaN(parsedSalary)) {
      payload.salary = parsedSalary;
    }

    // Run GraphQL update mutation using form payload
    this.apollo.mutate({
      mutation: UPDATE_EMPLOYEE,
      variables: payload
    }).subscribe({
      // Successful Update
      next: () => {
        // Success alert message and redirect to employee list page
        alert('Employee updated successfully.');
        this.router.navigate(['/employees']);
      },
      // Failed
      error: (err) => {
        // Log error
        console.error('Update attempt failed:', err);

        // Extract GraphQL error
        const gqlError = err?.graphQLErrors?.[0];

        // Extract validation errors
        const validationErrors = gqlError?.extensions?.validationErrors;

        // Extract any network Error
        let networkError = err?.networkError?.result?.errors?.[0]?.message || err?.networkError?.message;
        
        // Generic server message in event backend unreachable
        if (networkError === 'Failed to fetch') {
          networkError = 'Unable to connect to server. Please try again later.';
        }

        // Set error message list with validation errors if present, otherwise default to GraphQL or network error
        this.errorMessageList = Array.isArray(validationErrors)
          ? validationErrors
          : [gqlError?.message || networkError || 'An unexpected error has occurred.'];
      }
    });
  }
}
