import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelsetComponent } from './labelset.component';

describe('LabelsetComponent', () => {
  let component: LabelsetComponent;
  let fixture: ComponentFixture<LabelsetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabelsetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
