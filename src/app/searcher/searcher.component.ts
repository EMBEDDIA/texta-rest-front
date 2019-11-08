import {Component, OnDestroy, OnInit} from '@angular/core';
import {SearchService} from './services/search.service';
import {Search} from "../shared/types/Search";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";

@Component({
  selector: 'app-searcher',
  templateUrl: './searcher.component.html',
  styleUrls: ['./searcher.component.scss'],
  providers: [SearchService]
})
export class SearcherComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject();
  isSearch = true;
  isAggregation = false;

  constructor(private searchService: SearchService) {
  }

  ngOnInit() {
    this.searchService.getSearch().pipe(takeUntil(this.destroy$)).subscribe((value: Search) => {
      if (value) {
        this.isAggregation = false;
        this.isSearch = true;
      }
    });
    this.searchService.getAggregation().pipe(takeUntil(this.destroy$)).subscribe((aggregation: any) => {
      if (aggregation) {
        this.isSearch = false;
        this.isAggregation = true;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}
