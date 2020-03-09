import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {BuildSearchComponent} from './build-search/build-search.component';
import {take, takeUntil} from 'rxjs/operators';
import {SaveSearchDialogComponent} from './dialogs/save-search-dialog/save-search-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {SavedSearchesComponent} from './saved-searches/saved-searches.component';
import {ConfirmDialogComponent} from '../../shared/components/dialogs/confirm-dialog/confirm-dialog.component';
import {SearcherService} from '../../core/searcher/searcher.service';
import {Project} from '../../shared/types/Project';
import {ProjectStore} from '../../core/projects/project.store';
import {LogService} from '../../core/util/log.service';
import {SearcherComponentService} from '../services/searcher-component.service';
import {SavedSearch} from '../../shared/types/SavedSearch';
import {GenericDialogComponent} from '../../shared/components/dialogs/generic-dialog/generic-dialog.component';

@Component({
  selector: 'app-searcher-sidebar',
  templateUrl: './searcher-sidebar.component.html',
  styleUrls: ['./searcher-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearcherSidebarComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject();
  @ViewChild(BuildSearchComponent)
  private buildSearchComponent: BuildSearchComponent;
  @ViewChild(SavedSearchesComponent)
  private savedSearchesComponent: SavedSearchesComponent;
  @ViewChild('buildSearchPanel') buildSearchPanel: any;
  @ViewChild('savedSearchesPanel') savedSearchesPanel: any;
  @ViewChild('aggregationsPanel') aggregationsPanel: any;

  buildSearchExpanded = true;
  savedSearchesExpanded = true;
  aggregationsExpanded = false;
  currentProject: Project;

  constructor(public dialog: MatDialog,
              private searcherService: SearcherService,
              private searchService: SearcherComponentService,
              private projectStore: ProjectStore,
              private logService: LogService) {
  }

  ngOnInit() {
    this.projectStore.getCurrentProject().pipe(takeUntil(this.destroy$)).subscribe(proj => {
      if (proj) {
        this.currentProject = proj;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  expandBuildSearchPanel() {
    this.buildSearchExpanded = !this.buildSearchExpanded;
  }

  expandSavedSearchesPanel() {
    this.savedSearchesExpanded = !this.savedSearchesExpanded;
  }

  expandAggregationspanel() {
    this.aggregationsExpanded = !this.aggregationsExpanded;
  }

  openViewQueryDialog() {
    this.searchService.getElasticQuery().pipe(take(1)).subscribe(x => {
      if (x) {
        this.dialog.open(GenericDialogComponent, {
          data: {
            data: {query: x.elasticSearchQuery.query}
          },
          maxHeight: '500px',
          maxWidth: '500px'
        });
      }
    });

  }

  openSaveSearchDialog() {
    const dialogRef = this.dialog.open(SaveSearchDialogComponent, {
      maxHeight: '300px',
      width: '300px'
    });
    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((resp: string) => {
      if (resp) {
        this.buildSearchComponent.saveSearch(resp);
        this.logService.snackBarMessage('Successfully saved search.', 2000);
      }
    });
  }

  onDeleteAllSelected() {

    const selectedRows = this.searchService.savedSearchSelection;
    if (selectedRows.selected.length > 0) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          confirmText: 'Delete',
          mainText: `Are you sure you want to delete ${selectedRows.selected.length} Searches?`
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const idsToDelete = selectedRows.selected.map((savedSearch: SavedSearch) => savedSearch.id);
          const body = {ids: idsToDelete};
          this.searcherService.bulkDeleteSavedSearches(this.currentProject.id, body).subscribe(() => {
            this.logService.snackBarMessage(
              `Deleted ${selectedRows.selected.length > 1 ? selectedRows.selected.length : ''} search${selectedRows.selected.length > 1 ? 'es' : ''}`, 2000);
            this.savedSearchesComponent.removeSelectedRows();
          });
        }
      });
    }
  }

  notifyBuildSearch(savedSearch: any) { // todo object
    this.buildSearchComponent.buildSavedSearch(savedSearch);
  }

}
