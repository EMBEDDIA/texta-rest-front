import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagDocDialogComponent } from './tag-doc-dialog.component';

describe('TagDocDialogComponent', () => {
  let component: TagDocDialogComponent;
  let fixture: ComponentFixture<TagDocDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagDocDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagDocDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
