import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Mock implementation to get the host ID
  getHostId(): number {
    // Replace this with your actual implementation to get the host ID
    // For example, you can store the host ID in a variable when the user logs in
    // and then return it here.
    return 1; // Replace 1 with the actual host ID
  }

}
