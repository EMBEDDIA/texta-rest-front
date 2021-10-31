import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {forkJoin, Observable, of, Subject} from 'rxjs';
import {ErrorStateMatcher} from '@angular/material/core';
import {filter, map, mergeMap, startWith, switchMap, take, takeUntil} from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {LiveErrorStateMatcher} from '../../../shared/CustomerErrorStateMatchers';
import {Project, ProjectIndex} from '../../../shared/types/Project';
import {ProjectService} from '../../../core/projects/project.service';
import {AnnotatorService} from '../../../core/tools/annotator/annotator.service';
import {LogService} from '../../../core/util/log.service';
import {ProjectStore} from '../../../core/projects/project.store';
import {UtilityFunctions} from '../../../shared/UtilityFunctions';
import {Choice} from '../../../shared/types/tasks/Embedding';

interface OnSubmitParams {
  descriptionFormControl: string;
  indicesFormControl: ProjectIndex[];
  fieldsFormControl: string;
  annotationTypeFormControl: 'binary' | 'multilabel' | 'a';
  binaryFormGroup: {
    factNameFormControl: string;
    posValFormControl: string;
    negValFormControl: string;
  };
}

@Component({
  selector: 'app-create-annotator-dialog',
  templateUrl: './create-annotator-dialog.component.html',
  styleUrls: ['./create-annotator-dialog.component.scss']
})
export class CreateAnnotatorDialogComponent implements OnInit, OnDestroy {
  defaultQuery = '{"query": {"match_all": {}}}';
  query: unknown = this.defaultQuery;

  annotatorForm = new FormGroup({
    descriptionFormControl: new FormControl('', [Validators.required]),
    indicesFormControl: new FormControl([], [Validators.required]),
    fieldsFormControl: new FormControl([], [Validators.required]),
    annotationTypeFormControl: new FormControl('', [Validators.required]),
    binaryFormGroup: new FormGroup({
      factNameFormControl: new FormControl('', [Validators.required]),
      posValFormControl: new FormControl('', [Validators.required]),
      negValFormControl: new FormControl('', [Validators.required])
    })
  });

  matcher: ErrorStateMatcher = new LiveErrorStateMatcher();
  currentProject: Project;
  destroyed$: Subject<boolean> = new Subject<boolean>();
  projectIndices: ProjectIndex[] = [];
  projectFields: ProjectIndex[];
  // tslint:disable-next-line:no-any
  annotatorOptions: any;
  annotatorTypes: Choice[];
  projectFacts: string[] = [];
  filteredProjectFacts: Observable<string[]>;

  constructor(private dialogRef: MatDialogRef<CreateAnnotatorDialogComponent>,
              private projectService: ProjectService,
              private annotatorService: AnnotatorService,
              private logService: LogService,
              private projectStore: ProjectStore) {
  }

  ngOnInit(): void {
    this.projectStore.getCurrentProject().pipe(take(1), switchMap(proj => {
      if (proj) {
        this.currentProject = proj;
        return forkJoin({
          annotatorOptions: this.annotatorService.getAnnotatorOptions(proj.id),
          selectedIndices: this.projectStore.getSelectedProjectIndices().pipe(filter(x => !!x), take(1))
        });
      }
      return of(null);
    })).subscribe(resp => {
      if (resp?.annotatorOptions && !(resp.annotatorOptions instanceof HttpErrorResponse)) {
        this.annotatorOptions = resp.annotatorOptions;
        this.annotatorTypes = resp.annotatorOptions.actions.POST.annotation_type.choices;
      }
      if (resp?.selectedIndices && !(resp.selectedIndices instanceof HttpErrorResponse)) {
        const indicesForm = this.annotatorForm.get('indicesFormControl');
        indicesForm?.setValue(resp.selectedIndices);
        this.projectFields = ProjectIndex.cleanProjectIndicesFields(resp.selectedIndices, ['text'], []);
        this.getFactsForIndices(indicesForm?.value);
      }
      UtilityFunctions.logForkJoinErrors(resp, HttpErrorResponse, this.logService.snackBarError);
    });

    this.projectStore.getProjectIndices().pipe(takeUntil(this.destroyed$)).subscribe(projIndices => {
      if (projIndices) {
        this.projectIndices = projIndices;
      }
    });

    this.filteredProjectFacts = this.annotatorForm?.get('binaryFormGroup')?.get('factNameFormControl')?.valueChanges
        .pipe(takeUntil(this.destroyed$),
            startWith(''),
            map(val => this.filter(val))
        ) || of([]);
  }

  onSubmit(formData: OnSubmitParams): void {
    const body = {
      description: formData.descriptionFormControl,
      indices: formData.indicesFormControl.map(x => [{name: x.index}]).flat(),
      fields: formData.fieldsFormControl,
      ...this.query ? {query: this.query} : {},
      annotation_type: formData.annotationTypeFormControl,
      ...formData.annotationTypeFormControl === 'binary' ?
          {
            binary_configuration: {
              fact_name: formData.binaryFormGroup.factNameFormControl,
              pos_value: formData.binaryFormGroup.posValFormControl,
              neg_value: formData.binaryFormGroup.negValFormControl
            }
          } : {},
    };
    this.annotatorService.createAnnotatorTask(this.currentProject.id, body).subscribe(resp => {
      if (resp && !(resp instanceof HttpErrorResponse)) {
        this.logService.snackBarMessage(`Created new task: ${resp.description}`, 2000);
        this.dialogRef.close(resp);
      } else if (resp instanceof HttpErrorResponse) {
        this.logService.snackBarError(resp, 5000);
      }
    });
  }

  getFactsForIndices(val: ProjectIndex[]): void {
    if (val.length > 0) {
      this.projectFacts = [];
      this.projectService.getProjectFacts(this.currentProject.id, val.map((x: ProjectIndex) => [{name: x.index}]).flat()).pipe(takeUntil(this.destroyed$)).subscribe(resp => {
        if (resp && !(resp instanceof HttpErrorResponse)) {
          this.projectFacts = resp;
        } else {
          this.logService.snackBarError(resp);
        }
      });
    } else {
      this.projectFacts = [];
    }
  }

  public indicesOpenedChange(opened: unknown): void {
    const indicesForm = this.annotatorForm.get('indicesFormControl');
    // true is opened, false is closed, when selecting something and then deselecting it the formcontrol returns empty array
    if (!opened && indicesForm?.value && !UtilityFunctions.arrayValuesEqual(indicesForm?.value, this.projectFields, (x => x.index))) {
      this.projectFields = ProjectIndex.cleanProjectIndicesFields(indicesForm.value, ['text'], []);
      this.getFactsForIndices(indicesForm?.value);
    }
  }

  onQueryChanged(query: unknown): void {
    this.query = query ? query : this.defaultQuery;
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  filter(val: string): string[] {
    return this.projectFacts.filter(option =>
        option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
}
