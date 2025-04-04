// Created by Adam Simcoe - 101442161
// Last Updated - April 3rd, 2025

// Imports
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { GET_ALL_EMPLOYEES, SEARCH_EMPLOYEES, DELETE_EMPLOYEE } from './employee-list.graphql';
import { map, Observable, filter } from 'rxjs';
import { gql } from 'apollo-angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

// Component Setup
@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})

export class EmployeeListComponent implements OnInit {
  // Initialize employee list
  employees$!: Observable<any[]>;

  // Initialize search fields
  searchDepartment = '';
  searchDesignation = '';

  // Constructor injection
  constructor(private apollo: Apollo, private authService: AuthService, private router: Router) {}

  // Run once component intiailized
  ngOnInit(): void {
    // Fetch all employees in DB 
    this.fetchEmployees();

    // Re-fetch when navigation occurs (such as redirects from add/update forms)
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.fetchEmployees();
    });
  }

  // fetch employee list method with potential search params
  fetchEmployees(department?: string, designation?: string): void {
    // If search field(s) provided, use GraphQL search query to update list
    // if none provided, use GraphQL query to get all employees
    this.employees$ = this.apollo.watchQuery<any>({
      query: department || designation ? SEARCH_EMPLOYEES: GET_ALL_EMPLOYEES,
      variables: {
        department,
        designation
      },
      // Ensure not cached data
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      // Extract query data to display
      map(result => result.data.getAllEmployees ?? result.data.searchEmployees)
    );
  }

  // Search submit method to clean user input
  onSearch(): void {
    // Trim user input for fields
    const dept = this.searchDepartment.trim();
    const desig = this.searchDesignation.trim();
    
    // Pass clean inputs to fetchEmployees
    this.fetchEmployees(dept || undefined, desig || undefined);
  }
  // Clear search method
  clearSearch(): void {
    // Clear search filters
    this.searchDepartment = '';
    this.searchDesignation = '';

    // Re-fetch entire employee list
    this.fetchEmployees();
  }

  // Delete employee method
  confirmDelete(id: string): void {
    // Set confirm delete message
    const confirmDelete = confirm('Are you sure you want to delete this employee?');

    // If canceled
    if (!confirmDelete) return;

    // If confirmed, run GraphQL delete mutation using employee id
    this.apollo.mutate({
      mutation: DELETE_EMPLOYEE,
      variables: { eid: id },
      // Update employee list after deletion
      refetchQueries: [{ query: GET_ALL_EMPLOYEES }]
    }).subscribe(() => {
      // Success alert message
      alert('Employee has been deleted successfully.');
      // Re-fetch employee list
      this.fetchEmployees();
    });
  }

  // Logout method
  logout() {
    // Clear user session from local storage
    this.authService.logout();

    // Redirect user to login page
    this.router.navigate(['/login']);
  }
}
