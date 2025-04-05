// Created by Adam Simcoe - 101442161
// Last Updated - April 1st, 2025

// Imports
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { GET_EMPLOYEE_BY_ID } from './employee-details.graphql';
import { DELETE_EMPLOYEE } from '../employee-list/employee-list.graphql';

// Component Setup
@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css'
})

export class EmployeeDetailsComponent implements OnInit, OnDestroy {
  
  // Initialize employee data 
  employee: any = null;

  // Set boolean to track if employee data is loaded
  isLoading = true;

  // Initialize timeout id
  private timeoutId: any;

  // Initialize retry interval
  private retryInterval: any;

  // Constructor injection
  constructor(private route: ActivatedRoute, private router: Router, private apollo: Apollo) {}

  // Run once component intialized
  ngOnInit(): void {
    // Extract employee ID from route
    const id = this.route.snapshot.paramMap.get('id');

    // Timeout redirect for if employee data can not be fetched within 15 seconds
    this.timeoutId = setTimeout(() => {
      if (!this.employee) {
        alert('Employee data could not be loaded in time. Redirecting to Employee List page.');
        this.router.navigate(['/employees']);
      }
    }, 15000);

    // If id present
    if (id) {
      // Set retry interval to continue attempting query
      this.retryInterval = setInterval(() => {
        this.apollo.watchQuery<any>({
          query: GET_EMPLOYEE_BY_ID,
          variables: { eid: id },            
          fetchPolicy: 'network-only'
        }).valueChanges.subscribe({
          next: (result) => {
            // Extract employee data
            const employee = result.data.getEmployeeById;
            
            // If employee data successfully extracted, set employee data and clear timeout/interval
            if (employee) {
              this.employee = employee;
              this.isLoading = false;
              clearTimeout(this.timeoutId);
              clearInterval(this.retryInterval);
            }
          }
        });
      // Retry query every 1s
      }, 1000);
    }
  }

  // Clear timeout and retry interval if user leaves before automatic redirect
  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      clearInterval(this.retryInterval);
    }
  }

  // Delete employee method
  confirmDelete(): void {
    // Set confirm message
    const confirmDelete = confirm('Are you sure you want to delete this employee?');

    // if confirm accepted and employee exists with valid id
    if (confirmDelete && this.employee?._id) {
      // Run GraphQL delete mutation using employee id
      this.apollo.mutate({
        mutation: DELETE_EMPLOYEE,
        variables: { eid: this.employee._id }
      }).subscribe(() => {
        // Alert success message and redirect to employee list page
        alert('Employee has been deleted successfully.');
        this.router.navigate(['/employees']);
      });
    }
  }
}
