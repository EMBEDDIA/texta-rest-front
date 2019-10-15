import {Component, OnDestroy, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {startWith, switchMap} from 'rxjs/operators';
import {LogService} from '../../core/util/log.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Project} from '../../shared/types/Project';
import {Subscription} from 'rxjs';
import {ProjectStore} from '../../core/projects/project.store';
import {MatDialog, MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import {TaggerGroup} from '../../shared/types/tasks/Tagger';
import {CreateTaggerGroupDialogComponent} from './create-tagger-group-dialog/create-tagger-group-dialog.component';
import {TaggerGroupService} from '../../core/taggers/tagger-group.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-tagger-group',
  templateUrl: './tagger-group.component.html',
  styleUrls: ['./tagger-group.component.scss']
})
export class TaggerGroupComponent implements OnInit, OnDestroy, AfterViewInit {
  private projectSubscription: Subscription;
  private dialogAfterClosedSubscription: Subscription;

  expandedElement: TaggerGroup | null;
  public tableData: MatTableDataSource<TaggerGroup> = new MatTableDataSource();
  selectedRows = new SelectionModel<TaggerGroup>(true, []);
  public displayedColumns = ['id', 'description', 'fact_name', 'minimum_sample_size', 'Modify'];
  public isLoadingResults = true;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  currentProject: Project;
  resultsLength: number;


  constructor(public dialog: MatDialog,
              private projectStore: ProjectStore,
              private taggerGroupService: TaggerGroupService,
              private logService: LogService) {
  }

  ngOnInit() {
    this.tableData.sort = this.sort;
    this.tableData.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.projectSubscription = this.projectStore.getCurrentProject().subscribe(
      (resp: HttpErrorResponse | Project) => {
      if (resp && !(resp instanceof HttpErrorResponse)) {
        this.currentProject = resp;
        this.setUpPaginator();
      } else if (resp instanceof HttpErrorResponse) {
        this.logService.snackBarError(resp, 5000);
        this.isLoadingResults = false;
      }
    });
  }

  setUpPaginator() {
    this.paginator.page.pipe(startWith({}), switchMap(() => {
      this.isLoadingResults = true;
      return this.taggerGroupService.getTaggerGroups(
        this.currentProject.id,
        // Add 1 to to index because Material paginator starts from 0 and DRF paginator from 1
        `page=${this.paginator.pageIndex + 1}&page_size=${this.paginator.pageSize}`
        );
    })).subscribe((data: {count: number, results: TaggerGroup[]}) => {
      // Flip flag to show that loading has finished.
      this.isLoadingResults = false;
      this.resultsLength = data.count;
      this.tableData.data = data.results;
    });
  }

  ngOnDestroy() {
    if (this.projectSubscription) {
      this.projectSubscription.unsubscribe();
    }
    if (this.dialogAfterClosedSubscription) {
      this.dialogAfterClosedSubscription.unsubscribe();
    }
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(CreateTaggerGroupDialogComponent, {
      height: '860px',
      width: '700px',
    });
    this.dialogAfterClosedSubscription = dialogRef.afterClosed().subscribe((resp: TaggerGroup | HttpErrorResponse) => {
      if (resp && !(resp instanceof HttpErrorResponse)) {
        this.tableData.data = [...this.tableData.data, resp];
      } else if (resp instanceof HttpErrorResponse) {
        this.logService.snackBarError(resp, 5000);
      }
    });
  }
}
