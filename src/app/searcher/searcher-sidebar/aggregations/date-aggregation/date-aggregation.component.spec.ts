import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DateAggregationComponent} from './date-aggregation.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedModule} from '../../../../shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SearchService} from '../../../services/search.service';
import {AggregationsComponent} from '../aggregations.component';
import {SearchServiceSpy} from '../../../services/search.service.spec';

describe('DateAggregationComponent', () => {
  let component: DateAggregationComponent;
  let fixture: ComponentFixture<DateAggregationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DateAggregationComponent],
      imports: [
        SharedModule, HttpClientTestingModule, RouterTestingModule, BrowserAnimationsModule,
      ],
    }).overrideComponent(DateAggregationComponent, {
      set: {
        providers: [
          {provide: SearchService, useClass: SearchServiceSpy}
        ]
      }
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateAggregationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
