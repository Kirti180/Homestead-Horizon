import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router'; // Import Router to use for navigation

@Component({
  selector: 'app-host-popup',
  templateUrl: './host-popup.component.html',
  styleUrls: ['./host-popup.component.css']
})
export class HostPopupComponent {

  // Initialize the properties
  hostEmail: string = '';
  hostPassword: string = '';

  constructor(public dialogRef: MatDialogRef<HostPopupComponent>, private http: HttpClient, private router: Router) {}

  onSubmit() {
    // Make the HTTP POST request to the backend for login validation
    const loginData = {
      host_email: this.hostEmail,
      host_password: this.hostPassword
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    // Replace 'your-backend-api-url' with the actual URL of your backend API endpoint for host login
    this.http.post<any>('http://localhost:5000/hosts/login', loginData, httpOptions).subscribe(
      response => {
        // Check the response from the backend
        if (response.message === 'Host login successful!') {
          // Login successful, close the dialog and navigate to the property page
          this.dialogRef.close();
          // Navigate to the 'property' route
          this.router.navigate(['/property']); // Use an absolute path here
        } else {
          // Handle the response when login is unsuccessful
          console.log('Invalid credentials');
        }
      },
      error => {
        // Handle the error if the request fails
        console.error('Error occurred during login:', error);
      }
    );
  }

  onCancel() {
    this.dialogRef.close();
  }
}
