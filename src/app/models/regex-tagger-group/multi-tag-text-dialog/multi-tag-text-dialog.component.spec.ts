import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiTagTextDialogComponent } from './multi-tag-text-dialog.component';

describe('MultiTagTextDialogComponent', () => {
  let component: MultiTagTextDialogComponent;
  let fixture: ComponentFixture<MultiTagTextDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiTagTextDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiTagTextDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
