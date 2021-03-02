import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {LiveErrorStateMatcher} from '../../../shared/CustomerErrorStateMatchers';
import {Field, Project, ProjectIndex} from '../../../shared/types/Project';
import {forkJoin, from, of, Subject} from 'rxjs';
import {filter, mergeMap, switchMap, take, takeUntil} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {UtilityFunctions} from '../../../shared/UtilityFunctions';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ProjectService} from '../../../core/projects/project.service';
import {LogService} from '../../../core/util/log.service';
import {ProjectStore} from '../../../core/projects/project.store';
import {BertTaggerService} from '../../../core/models/taggers/bert-tagger/bert-tagger.service';
import {BertTagger} from '../../../shared/types/tasks/BertTagger';

interface SubmitFormModel {
  descriptionFormControl: string;
  indicesFormControl: ProjectIndex[];
  fieldsFormControl: Field[];
  factNameFormControl: string;
  factValueFormControl: string;
  esTimeoutFormControl: number;
  bulkSizeFormControl: number;
  chunkSizeFormControl: number;
}

@Component({
  selector: 'app-apply-to-index-dialog',
  templateUrl: './apply-to-index-dialog.component.html',
  styleUrls: ['./apply-to-index-dialog.component.scss']
})
export class ApplyToIndexDialogComponent implements OnInit, OnDestroy {
  defaultQuery = '{"query": {"match_all": {}}}';
  query = this.defaultQuery;

  applyForm = new FormGroup({
    descriptionFormControl: new FormControl('', [Validators.required]),
    indicesFormControl: new FormControl([], [Validators.required]),
    fieldsFormControl: new FormControl([], [Validators.required]),
    factNameFormControl: new FormControl('', [Validators.required]),
    factValueFormControl: new FormControl(''),
    esTimeoutFormControl: new FormControl(),
    bulkSizeFormControl: new FormControl(),
    chunkSizeFormControl: new FormControl(),

  });

  matcher: ErrorStateMatcher = new LiveErrorStateMatcher();
  currentProject: Project;
  destroyed$: Subject<boolean> = new Subject<boolean>();
  indices: ProjectIndex[];
  fieldsUnique: Field[] = [];

  constructor(private dialogRef: MatDialogRef<ApplyToIndexDialogComponent>,
              private projectService: ProjectService,
              @Inject(MAT_DIALOG_DATA) public data: BertTagger,
              private bertTaggerService: BertTaggerService,
              private logService: LogService,
              private projectStore: ProjectStore) {
  }

  ngOnInit(): void {
    this.projectStore.getCurrentProject().pipe(filter(x => !!x), take(1)).subscribe(proj => {
      if (proj) {
        this.currentProject = proj;
      }
    });
    this.projectStore.getProjectIndices().pipe(filter(x => !!x), take(1)).subscribe(indices => {
      if (indices) {
        this.indices = indices;
      }
    });
  }

  getFieldsForIndices(indices: ProjectIndex[]): void {
    indices = ProjectIndex.cleanProjectIndicesFields(indices, [], ['fact'], true);
    this.fieldsUnique = UtilityFunctions.getDistinctByProperty<Field>(indices.map(y => y.fields).flat(), (y => y.path));
  }

  public indicesOpenedChange(opened: boolean): void {
    const indicesForm = this.applyForm.get('indicesFormControl');
    // true is opened, false is closed, when selecting something and then deselecting it the formcontrol returns empty array
    if (!opened && (indicesForm?.value && indicesForm.value.length > 0)) {
      this.getFieldsForIndices(indicesForm?.value);
    }
  }

  onQueryChanged(query: string): void {
    this.query = query ? query : this.defaultQuery;
  }

  onSubmit(formData: SubmitFormModel): void {
    const body = {
      description: formData.descriptionFormControl,
      new_fact_name: formData.factNameFormControl,
      ...formData.factValueFormControl ? {new_fact_value: formData.factValueFormControl} : {},
      indices: formData.indicesFormControl.map((x: ProjectIndex) => [{name: x.index}]).flat(),
      fields: formData.fieldsFormControl,
      ...this.query ? {query: this.query} : {},
      ...formData.esTimeoutFormControl ? {es_timeout: formData.esTimeoutFormControl} : {},
      ...formData.bulkSizeFormControl ? {bulk_size: formData.bulkSizeFormControl} : {},
      ...formData.chunkSizeFormControl ? {max_chunk_bytes: formData.chunkSizeFormControl} : {},
    };
    this.bertTaggerService.applyToIndex(this.currentProject.id, this.data.id, body).subscribe(resp => {
      if (resp && !(resp instanceof HttpErrorResponse)) {
        this.logService.snackBarMessage(`${resp.message}`, 2000);
        this.dialogRef.close(resp);
      } else if (resp instanceof HttpErrorResponse) {
        this.logService.snackBarError(resp, 5000);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
