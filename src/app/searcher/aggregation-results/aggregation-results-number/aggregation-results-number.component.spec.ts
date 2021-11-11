import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggregationResultsNumberComponent } from './aggregation-results-number.component';

describe('AggregationResultsNumberComponent', () => {
  let component: AggregationResultsNumberComponent;
  let fixture: ComponentFixture<AggregationResultsNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AggregationResultsNumberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AggregationResultsNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
