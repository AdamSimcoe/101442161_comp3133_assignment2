// Created by Adam Simcoe - 101442161
// Last Updated - April 4th, 2025

// Imports
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

// Component Imports
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { EmployeeListComponent } from './components/employees/employee-list/employee-list.component';
import { AddEmployeeComponent } from './components/employees/add-employee/add-employee.component';
import { EmployeeDetailsComponent } from './components/employees/employee-details/employee-details.component';
import { UpdateEmployeeComponent } from './components/employees/update-employee/update-employee.component';

// Route Setup
// Employee components protected by auth guard to prevent unauthenticated access
export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'employees', component: EmployeeListComponent, runGuardsAndResolvers: 'always', canActivate: [authGuard] },
    { path: 'employees/add', component: AddEmployeeComponent, canActivate: [authGuard] },
    { path: 'employees/:id', component: EmployeeDetailsComponent, canActivate: [authGuard] },
    { path: 'employees/update/:id', component: UpdateEmployeeComponent, canActivate: [authGuard] },
];