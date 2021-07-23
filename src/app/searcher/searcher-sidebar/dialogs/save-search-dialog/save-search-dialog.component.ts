import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {LiveErrorStateMatcher} from '../../../../shared/CustomerErrorStateMatchers';
import {Project} from '../../../../shared/types/Project';
import {of, Subject} from 'rxjs';
import {SearcherService} from '../../../../core/searcher/searcher.service';
import {ProjectStore} from '../../../../core/projects/project.store';
import {switchMap, takeUntil} from 'rxjs/operators';
import {SavedSearch} from '../../../../shared/types/SavedSearch';
import {HttpErrorResponse} from '@angular/common/http';
import {LogService} from '../../../../core/util/log.service';

@Component({
  selector: 'app-save-search-dialog',
  templateUrl: './save-search-dialog.component.html',
  styleUrls: ['./save-search-dialog.component.scss']
})
export class SaveSearchDialogComponent implements OnInit {

  matcher: ErrorStateMatcher = new LiveErrorStateMatcher();
  currentProject: Project;
  destroyed$: Subject<boolean> = new Subject<boolean>();
  savedSearches: SavedSearch[] = [];
  selectedSearch: SavedSearch;
  newDesc = '';
  method: 'existing' | 'new' = 'new';

  constructor(private dialogRef: MatDialogRef<SaveSearchDialogComponent>, private searcherService: SearcherService,
              private logService: LogService,
              private projectStore: ProjectStore) {
  }

  ngOnInit(): void {
    this.projectStore.getCurrentProject().pipe(takeUntil(this.destroyed$), switchMap(proj => {
      if (proj) {
        return this.searcherService.getSavedSearches(proj.id);
      } else {
        return of(null);
      }
    })).subscribe(resp => {
      if (resp && !(resp instanceof HttpErrorResponse)) {
        this.savedSearches = resp;
      } else if (resp) {
        this.logService.snackBarError(resp);
      }
    });
  }

  onSubmit(): void {
    if (this.currentProject.id) {
      if (this.method === 'existing' && this.selectedSearch.id) {
        /*        this.searcherService.editSavedSearch(this.currentProject.id, this.selectedSearch.id, this.selectedSearch).subscribe(resp => {
                  if (resp && !(resp instanceof HttpErrorResponse)) {
                    this.logService.snackBarMessage('Updated saved search: ' + this.selectedSearch.description, 5000);
                    this.closeDialog();
                  } else if (resp) {
                    this.logService.snackBarError(resp);
                  }
                });*/
      } else {

      }
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
