// app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HostComponent } from './host/host.component';
import { HostPopupComponent } from './host/host-popup/host-popup.component';
import { PropertyComponent } from './property/property.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './auth/auth.service'; // Import the AuthService

@NgModule({
  declarations: [AppComponent, NavbarComponent, HostComponent, HostPopupComponent, PropertyComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    AppRoutingModule,
  ],
  providers: [AuthService], // Add AuthService to the providers array
  bootstrap: [AppComponent],
})
export class AppModule {}
