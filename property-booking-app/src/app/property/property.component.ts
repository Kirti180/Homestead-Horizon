import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

interface Property {
  property_id: number;
  property_name: string;
  property_type: string;
  property_price: number;
  host_id: number;
  image_url: string;
  location: string;
}

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit {

  // Initialize the form data
  propertyName: string = '';
  propertyType: string = '';
  propertyPrice: number | null = null;
  hostId: number | null = null;
  imageUrl: string = '';
  location: string = '';

  // Store all properties and filtered properties for the logged-in host
  allProperties: Property[] = [];
  properties: Property[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    // Fetch the host ID of the currently logged-in host
    this.hostId = this.authService.getHostId();
    // Fetch all properties
    this.fetchAllProperties();
  }

  fetchAllProperties() {
    // Replace 'your-backend-api-url' with the actual URL of your backend API endpoint for fetching all properties
    this.http.get<Property[]>('http://localhost:5000/properties').subscribe(
      (response: Property[]) => {
        this.allProperties = response;
        // Filter properties to display only those added by the logged-in host
        this.properties = response.filter(property => property.host_id === this.hostId);
      },
      (error: HttpErrorResponse) => {
        console.error('Error occurred while fetching properties:', error);
      }
    );
  }

  onSubmit() {
    // Make the HTTP POST request to the backend for adding a property
    const propertyData = {
      property_name: this.propertyName,
      property_type: this.propertyType,
      property_price: this.propertyPrice,
      host_id: this.hostId,
      image_url: this.imageUrl,
      location: this.location
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    // Replace 'your-backend-api-url' with the actual URL of your backend API endpoint for adding a property
    this.http.post<any>('http://localhost:5000/properties', propertyData, httpOptions).subscribe(
      (response: any) => {
        // Handle the response from the backend
        console.log(response);
        if (response && response.message === 'Property created successfully!') {
          alert('Property added successfully!');
          // Clear the form fields after successful property addition
          this.propertyName = '';
          this.propertyType = '';
          this.propertyPrice = null;
          this.imageUrl = '';
          this.location = '';
          // Fetch updated properties after adding a new property
          this.fetchAllProperties();
        } else {
          // Handle the response when the property addition is unsuccessful
          alert('Failed to add property. Please try again.');
        }
      },
      (error: HttpErrorResponse) => {
        // Handle the error if the request fails
        console.error('Error occurred while adding property:', error);
        // You can show an error message to the user if needed
        alert('Failed to add property. Please try again.');
      }
    );
  }
}
