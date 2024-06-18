import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishTrainingDialogComponent } from './finish-training-dialog.component';

describe('FinishTrainingDialogComponent', () => {
  let component: FinishTrainingDialogComponent;
  let fixture: ComponentFixture<FinishTrainingDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinishTrainingDialogComponent]
    });
    fixture = TestBed.createComponent(FinishTrainingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
