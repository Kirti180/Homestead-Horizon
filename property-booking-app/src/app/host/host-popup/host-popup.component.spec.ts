import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostPopupComponent } from './host-popup.component';

describe('HostPopupComponent', () => {
  let component: HostPopupComponent;
  let fixture: ComponentFixture<HostPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HostPopupComponent]
    });
    fixture = TestBed.createComponent(HostPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
