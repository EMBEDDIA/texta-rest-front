import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyTaggerGroupDialogComponent } from './apply-tagger-group-dialog.component';

describe('ApplyTaggerGroupDialogComponent', () => {
  let component: ApplyTaggerGroupDialogComponent;
  let fixture: ComponentFixture<ApplyTaggerGroupDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyTaggerGroupDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyTaggerGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
