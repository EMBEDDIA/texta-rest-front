import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagRandomDocComponent } from './tag-random-doc.component';

describe('TagRandomDocComponent', () => {
  let component: TagRandomDocComponent;
  let fixture: ComponentFixture<TagRandomDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagRandomDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagRandomDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
