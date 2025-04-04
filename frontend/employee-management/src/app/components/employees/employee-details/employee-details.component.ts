// Created by Adam Simcoe - 101442161
// Last Updated - April 1st, 2025

// Imports
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs';
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

export class EmployeeDetailsComponent implements OnInit {
  
  // Initialize employee data 
  employee: any = null;

  // Set boolean to track if employee data is loaded
  isLoading = true;

  // Constructor injection
  constructor(private route: ActivatedRoute, private router: Router, private apollo: Apollo) {}

  // Run once component intialized
  ngOnInit(): void {
    // Extract employee ID from route
    const id = this.route.snapshot.paramMap.get('id');

    // If id present
    if (id) {
      // GraphQL query to fetch all employee data for that ID
      this.apollo.watchQuery<any>({
        query: GET_EMPLOYEE_BY_ID,
        variables: { eid: id }
      }).valueChanges.pipe(
        // Extract employee data
        map(result => result.data.getEmployeeById)
      ).subscribe(employee => {
        // Assign employee data 
        this.employee = employee;
        // Hide loading display
        this.isLoading = false;
      });
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
