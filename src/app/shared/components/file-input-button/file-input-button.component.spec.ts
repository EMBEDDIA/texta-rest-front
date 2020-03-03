import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileInputButtonComponent } from './file-input-button.component';

describe('FileInputButtonComponent', () => {
  let component: FileInputButtonComponent;
  let fixture: ComponentFixture<FileInputButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileInputButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileInputButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
