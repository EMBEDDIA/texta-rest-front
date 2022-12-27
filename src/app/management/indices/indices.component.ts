import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {Project} from '../../shared/types/Project';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {LogService} from '../../core/util/log.service';
import {MatDialog} from '@angular/material/dialog';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {ConfirmDialogComponent} from '../../shared/shared-module/components/dialogs/confirm-dialog/confirm-dialog.component';
import {Index} from '../../shared/types/Index';
import {CoreService} from '../../core/core.service';
import {SelectionModel} from '@angular/cdk/collections';
import {
  ConfirmBulkDeleteDialogComponent
} from '../../shared/shared-module/components/dialogs/confirm-bulk-delete-dialog/confirm-bulk-delete-dialog.component';
import {MatButtonToggleChange} from '@angular/material/button-toggle';
import {EditDialogComponent} from './edit-dialog/edit-dialog.component';
import {UntypedFormControl} from '@angular/forms';
import {CreateDialogComponent} from './create-dialog/create-dialog.component';
import {TableFilter, TableFilterManager} from '../../shared/shared-module/components/generic-table/TableFilters';


@Component({
  selector: 'app-indices',
  templateUrl: './indices.component.html',
  styleUrls: ['./indices.component.scss']
})
export class IndicesComponent implements OnInit, AfterViewInit, OnDestroy {
  destroyed$: Subject<boolean> = new Subject<boolean>();
  projects: Project[];
  public tableData: MatTableDataSource<Index> = new MatTableDataSource<Index>([]);

  public displayedColumns = ['select', 'id', 'is_open', 'has_validated_facts', 'added_by', 'name', 'size', 'doc_count', 'created_at', 'actions'];
  public simplifiedTableColumns = ['select', 'id', 'is_open', 'has_validated_facts', 'added_by', 'name', 'size', 'doc_count', 'created_at', 'actions'];
  public informativeTableColumns = ['select', 'id', 'is_open', 'test', 'has_validated_facts', 'description', 'added_by', 'source', 'client', 'domain', 'name', 'size', 'doc_count', 'created_at', 'actions'];
  public isLoadingResults = true;
  public columnStyle: 'simplified' | 'informative' = 'simplified';
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  tableFilterManager: TableFilterManager;
  addedByFilter = new UntypedFormControl();
  nameFilter = new UntypedFormControl();
  domainFilter = new UntypedFormControl();

  resultsLength: number;
  filterTerm$ = new Subject<string>();
  selectedRows = new SelectionModel<Index>(true, []);

  constructor(private logService: LogService,
              public dialog: MatDialog,
              private coreService: CoreService) {
  }

  ngOnInit(): void {
    this.tableFilterManager = new TableFilterManager();
    this.tableFilterManager.addFilter(new TableFilter('added_by', '', this.addedByFilter));
    this.tableFilterManager.addFilter(new TableFilter('name', '', this.nameFilter));
    this.tableFilterManager.addFilter(new TableFilter('domain', '', this.domainFilter));
  }

  ngAfterViewInit(): void {
    this.tableData.sort = this.sort;
    this.tableData.paginator = this.paginator;
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.coreService.getElasticIndices().pipe(takeUntil(this.destroyed$)).subscribe(resp => {
      if (resp && !(resp instanceof HttpErrorResponse)) {
        this.resultsLength = resp.length;
        this.tableData.data = resp;
        this.tableFilterManager.setUpColumnFilters(this.tableData);
        this.isLoadingResults = false;
      }
    });
  }



  addFactMapping(row: Index): void {
    if (!row.has_validated_facts) {
      this.coreService.indexAddFactMapping(row).subscribe((resp) => {
        if (resp instanceof HttpErrorResponse) {
          this.logService.snackBarError(resp, 2000);
        } else if (resp) {
          this.logService.snackBarMessage(resp.message, 5000);
        }
      });
    }
  }

  toggleIndexState(row: Index): void {
    this.coreService.toggleElasticIndexOpenState(row).subscribe((resp) => {
      if (resp instanceof HttpErrorResponse) {
        this.logService.snackBarError(resp, 2000);
      }
    });
  }

  deleteIndex(index: Index): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        confirmText: 'Delete',
        mainText: `Delete index: ${index.id}: ${index.name}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.coreService.deleteElasticIndex(index.id).subscribe(x => {
          if (!(x instanceof HttpErrorResponse)) {
            this.tableData.data = this.tableData.data.filter(y => y.id !== index.id);
          }
        });
      }
    });
  }

  trackById(index: number, item: Index): number {
    return item.id;
  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selectedRows.selected.length;
    const numRows = this.tableData.filteredData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ?
      this.selectedRows.clear() :
      (this.tableData.filteredData as Index[]).forEach(row => this.selectedRows.select(row));
  }

  onDeleteAllSelected(): void {
    if (this.selectedRows.selected.length > 0) {
      const dialogRef = this.dialog.open(ConfirmBulkDeleteDialogComponent, {
        data: {
          confirmText: 'Delete',
          mainText: `Delete the following indices`,
          items: this.selectedRows.selected.map(x => x.name)
        },
        maxHeight: '90vh'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const idsToDelete = this.selectedRows.selected.map((evaluator: Index) => evaluator.id);
          this.coreService.bulkDeleteElasticIndices(idsToDelete).subscribe(response => {
            if (!(response instanceof HttpErrorResponse)) {
              this.logService.snackBarMessage(`Removed indices and related objects. Total deleted: ${response.num_deleted}`, 5000);
              this.removeSelectedRows();
            }
          });
        }
      });
    }
  }

  removeSelectedRows(): void {
    this.selectedRows.selected.forEach((selected: Index) => {
      const index: number = (this.tableData.filteredData as Index[]).findIndex(row => row.id === selected.id);
      this.tableData.data.splice(index, 1);
      this.tableData.data = [...this.tableData.data];
    });
    this.selectedRows.clear();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  changeTableStyle($event: MatButtonToggleChange): void {
    if ($event.value === 'simplified') {
      this.displayedColumns = this.simplifiedTableColumns;
    } else if ($event.value === 'informative') {
      this.displayedColumns = this.informativeTableColumns;
    }
  }

  editIndex(element: Index): void {
    this.dialog.open(EditDialogComponent, {
      maxHeight: '90vh',
      width: '800px',
      disableClose: true,
      data: element,
    });
  }

  openCreateDialog(): void {
    this.dialog.open(CreateDialogComponent, {
      maxHeight: '90vh',
      width: '700px',
      disableClose: true,
    }).afterClosed().subscribe(dialogResp => {
      if (dialogResp) {
        this.isLoadingResults = true;
        this.coreService.getElasticIndices().pipe(takeUntil(this.destroyed$)).subscribe(resp => {
          if (resp && !(resp instanceof HttpErrorResponse)) {
            this.resultsLength = resp.length;
            this.tableData.data = resp;
            this.isLoadingResults = false;
          }
        });
      }
    });
  }
}


