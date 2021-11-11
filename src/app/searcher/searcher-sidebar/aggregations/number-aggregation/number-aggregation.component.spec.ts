import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberAggregationComponent } from './number-aggregation.component';

describe('NumberAggregationComponent', () => {
  let component: NumberAggregationComponent;
  let fixture: ComponentFixture<NumberAggregationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumberAggregationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberAggregationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
