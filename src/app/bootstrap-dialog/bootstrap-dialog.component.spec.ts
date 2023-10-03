import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BootstrapDialogComponent } from './bootstrap-dialog.component';

describe('BootstrapDialogComponent', () => {
  let component: BootstrapDialogComponent;
  let fixture: ComponentFixture<BootstrapDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BootstrapDialogComponent]
    });
    fixture = TestBed.createComponent(BootstrapDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
