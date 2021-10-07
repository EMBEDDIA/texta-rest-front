import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyToIndexDialogComponent } from './apply-to-index-dialog.component';

describe('ApplyToIndexDialogComponent', () => {
  let component: ApplyToIndexDialogComponent;
  let fixture: ComponentFixture<ApplyToIndexDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyToIndexDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyToIndexDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
