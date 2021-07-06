import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CeleryComponent } from './celery.component';

describe('CeleryComponent', () => {
  let component: CeleryComponent;
  let fixture: ComponentFixture<CeleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CeleryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CeleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
