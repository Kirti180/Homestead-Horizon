import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HostPopupComponent } from '../host/host-popup/host-popup.component'; // Import HostPopupComponent

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(@Inject(MatDialog) public dialog: MatDialog) {} // Inject MatDialog using @Inject

  openHostPopup() {
    this.dialog.open(HostPopupComponent, {
      width: '400px'
    });
  }
}
