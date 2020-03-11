import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ElasticsearchQuery} from '../../build-search/Constraints';
import {FormControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {SearcherComponentService} from '../../../services/searcher-component.service';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-text-aggregation',
  templateUrl: './text-aggregation.component.html',
  styleUrls: ['./text-aggregation.component.scss']
})
export class TextAggregationComponent implements OnInit, OnDestroy {
  @Input() aggregationObj: { aggregation: any };
  @Input() fieldsFormControl: FormControl;
  isMainAgg: boolean;

  @Input() set isLastAgg(val: boolean) {
    this.isMainAgg = val;
    if (!this.isMainAgg) {
      this.aggregationType = 'terms';
    }
  }

  aggregationType: 'terms' | 'significant_text' | 'significant_terms' = 'terms';
  aggregationSize = 30;
  destroy$: Subject<boolean> = new Subject();

  constructor(
    private searchService: SearcherComponentService) {
  }

  ngOnInit() {
    // every time we get new search result refresh the query
    this.searchService.getElasticQuery().pipe(takeUntil(this.destroy$)).subscribe((query: ElasticsearchQuery | null) => {
      if (query) {
        this.updateAggregations();
      }
    });
    this.fieldsFormControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(val => {
      if (val) {
        this.updateAggregations();
      }
    });

  }

  updateAggregations() {
    if (this.isFormControlTypeOfFact()) {
      this.makeFactAggregation();
    } else {
      this.makeTextAggregation();
    }
  }


  makeFactAggregation() {
    let returnquery: { [key: string]: any };

    returnquery = {
      agg_fact: {
        nested: {
          path: this.fieldsFormControl.value.path
        },
        aggs: {
          agg_fact: {
            [this.aggregationType]: {
              field:
                `${this.fieldsFormControl.value.path}.fact`,
              size: this.aggregationSize,
            },
            aggs: {
              agg_fact_val: {
                [this.aggregationType]: {
                  field:
                    `${this.fieldsFormControl.value.path}.str_val`,
                  size: this.aggregationSize,
                },
              }
            }
          }
        }
      }
    };

    this.aggregationObj.aggregation = returnquery;
  }

  makeTextAggregation() {
    let returnquery: { [key: string]: any };

    returnquery = {
      agg_term: {
        [this.aggregationType]: {
          field:
            `${this.fieldsFormControl.value.path}${
              this.aggregationType === 'significant_terms' || this.aggregationType === 'terms' ? '.keyword' : ''}`,
          size: this.aggregationSize,
        }
      }
    };

    this.aggregationObj.aggregation = returnquery;
  }


  isFormControlTypeOfFact() {
    return this.fieldsFormControl &&
      this.fieldsFormControl.value && this.fieldsFormControl.value.type && this.fieldsFormControl.value.type === 'fact';
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
