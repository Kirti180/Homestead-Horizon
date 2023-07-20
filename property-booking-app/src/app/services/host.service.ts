// src/app/services/host.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HostService {
  private apiUrl = 'http://localhost:5000/'; // Replace with your actual backend API URL

  constructor(private http: HttpClient) { }

  loginHost(hostCredentials: { host_email: string; host_password: string }) {
    return this.http.post(`${this.apiUrl}/hosts/login`, hostCredentials);
  }
}
