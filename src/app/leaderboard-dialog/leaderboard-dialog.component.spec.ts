import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderboardDialogComponent } from './leaderboard-dialog.component';

describe('LeaderboardDialogComponent', () => {
  let component: LeaderboardDialogComponent;
  let fixture: ComponentFixture<LeaderboardDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeaderboardDialogComponent]
    });
    fixture = TestBed.createComponent(LeaderboardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
