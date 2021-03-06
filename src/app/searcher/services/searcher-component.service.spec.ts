import {TestBed} from '@angular/core/testing';

import {SearcherComponentService} from './searcher-component.service';
import {Search} from '../../shared/types/Search';
import {BehaviorSubject, Subject} from 'rxjs';
import {Constraint, ElasticsearchQuery} from '../searcher-sidebar/build-search/Constraints';
import {SavedSearch} from '../../shared/types/SavedSearch';
import {SelectionModel} from '@angular/cdk/collections';

export class SearchServiceSpy {
  public savedSearchSelection = new SelectionModel<SavedSearch>(true, []);
  private searchSubject = new BehaviorSubject<Search | null>(null);
  /* emit cloned test hero */
  getSearch = jasmine.createSpy('getSearch').and.callFake(
    () => this.searchSubject.asObservable()
  );
  /* emit clone of test hero, with changes merged in */
  nextSearch = jasmine.createSpy('nextSearch').and.callFake(
    (search: Search) => this.searchSubject.next(search));
  private searchQueryQueue$ = new Subject<void>();
  queryNextSearch = jasmine.createSpy('queryNextSearch').and.callFake(
    (search: Search) => this.searchQueryQueue$.next());
  getSearchQueue = jasmine.createSpy('getSearchQueue').and.callFake(
    () => this.searchQueryQueue$.asObservable()
  );
  private elasticQuerySubject = new Subject<ElasticsearchQuery>();
  nextElasticQuery = jasmine.createSpy('nextElasticQuery').and.callFake(
    (val: ElasticsearchQuery) => this.elasticQuerySubject.next(val));
  getElasticQuery = jasmine.createSpy('getElasticQuery').and.callFake(
    () => this.elasticQuerySubject.asObservable()
  );
  private savedSearchUpdate = new Subject<boolean>();
  nextSavedSearchUpdate = jasmine.createSpy('nextSavedSearchUpdate').and.callFake(
    (val: boolean) => this.savedSearchUpdate.next(val));
  getSavedSearchUpdate = jasmine.createSpy('getSavedSearchUpdate').and.callFake(
    () => this.savedSearchUpdate.asObservable()
  );
  private aggregationSubject = new BehaviorSubject<unknown>(null);
  nextAggregation = jasmine.createSpy('nextAggregation').and.callFake(
    (search: Search) => this.aggregationSubject.next(search));
  getAggregation = jasmine.createSpy('getAggregation').and.callFake(
    () => this.aggregationSubject.asObservable()
  );
  private isLoading = false;
  private savedSearch = new Subject<SavedSearch>();
  nextSavedSearch = jasmine.createSpy('nextSavedSearch').and.callFake(
    (val: SavedSearch) => this.savedSearch.next(val)
  );

  getSavedSearch = jasmine.createSpy('getSavedSearch').and.callFake(
    () => this.savedSearch.asObservable()
  );
  private advancedSearchConstraints$ = new Subject<Constraint[]>();
  nextAdvancedSearchConstraints$ = jasmine.createSpy('nextAdvancedSearchConstraints$').and.callFake(
    (val: Constraint[]) => this.advancedSearchConstraints$.next(val)
  );

  getAdvancedSearchConstraints$ = jasmine.createSpy('getAdvancedSearchConstraints$').and.callFake(
    () => this.advancedSearchConstraints$.asObservable()
  );

  setIsLoading(val: boolean): void {
    this.isLoading = val;
  }

  getIsLoading(): boolean {
    return this.isLoading;
  }
}

describe('SearcherComponentService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [SearcherComponentService]
  }));

  it('should be created', () => {
    const service: SearcherComponentService = TestBed.get(SearcherComponentService);
    expect(service).toBeTruthy();
  });
});
