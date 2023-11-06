import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalBottomSheetComponent } from './terminal-bottom-sheet.component';

describe('TerminalBottomSheetComponent', () => {
  let component: TerminalBottomSheetComponent;
  let fixture: ComponentFixture<TerminalBottomSheetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TerminalBottomSheetComponent]
    });
    fixture = TestBed.createComponent(TerminalBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
