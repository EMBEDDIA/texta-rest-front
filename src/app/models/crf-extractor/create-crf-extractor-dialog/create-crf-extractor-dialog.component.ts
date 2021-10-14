import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {forkJoin, of, Subject} from 'rxjs';
import {ErrorStateMatcher} from '@angular/material/core';
import {mergeMap, switchMap, take, takeUntil} from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {Field, Project, ProjectIndex} from '../../../shared/types/Project';
import {UtilityFunctions} from '../../../shared/UtilityFunctions';
import {CRFExtractorService} from '../../../core/models/crf-extractor/crf-extractor.service';
import {LiveErrorStateMatcher} from '../../../shared/CustomerErrorStateMatchers';
import {ProjectService} from '../../../core/projects/project.service';
import {ProjectStore} from '../../../core/projects/project.store';
import {LogService} from '../../../core/util/log.service';
import {Choice, Embedding} from '../../../shared/types/tasks/Embedding';
import {CRFExtractor} from '../../../shared/types/tasks/CRFExtractor';
import {EmbeddingsService} from '../../../core/models/embeddings/embeddings.service';

interface OnSubmitParams {
  descriptionFormControl: string;
  indicesFormControl: ProjectIndex[];
  mlpFieldsFormControl: string;
  windowSizeFormControl: number;
  testSizeFormControl: number;
  numIterFormControl: number;
  cValuesFormControl: string;
  biasFormControl: boolean;
  suffixLenFormControl: string;
  labelsFormControl: string[];
  featureFieldsFormControl: { value: string; display_value: string }[];
  contextFeatureFieldsFormControl: { value: string; display_value: string }[];
  featureExtractorsFormControl: { value: string; display_value: string }[];
  embeddingFormControl: Embedding;
}

@Component({
  selector: 'app-create-crf-extractor-dialog',
  templateUrl: './create-crf-extractor-dialog.component.html',
  styleUrls: ['./create-crf-extractor-dialog.component.scss']
})
export class CreateCRFExtractorDialogComponent implements OnInit, OnDestroy {

  defaultQuery = '{"query": {"match_all": {}}}';
  query = this.data?.cloneElement?.query || this.defaultQuery;
  labelDefaults = ['GPE', 'ORG', 'PER', 'LOC'];
  CRFExtractorForm = new FormGroup({
    descriptionFormControl: new FormControl(this.data?.cloneElement?.description || '', [Validators.required]),
    indicesFormControl: new FormControl([], [Validators.required]),
    mlpFieldsFormControl: new FormControl('', [Validators.required]),
    windowSizeFormControl: new FormControl(this.data?.cloneElement?.window_size || 2),
    testSizeFormControl: new FormControl(this.data?.cloneElement?.test_size || 0.3),
    numIterFormControl: new FormControl(this.data?.cloneElement?.num_iter || 100),
    cValuesFormControl: new FormControl(this.data?.cloneElement?.c_values.toString() || '0.001, 0.1, 0.5'),
    biasFormControl: new FormControl(this.data?.cloneElement?.bias !== undefined ? this.data?.cloneElement?.bias : true),
    suffixLenFormControl: new FormControl(this.data?.cloneElement?.suffix_len.toString() || '2,2'),
    labelsFormControl: new FormControl(),
    featureFieldsFormControl: new FormControl(),
    contextFeatureFieldsFormControl: new FormControl(),
    featureExtractorsFormControl: new FormControl(),
    embeddingFormControl: new FormControl(),
  });

  matcher: ErrorStateMatcher = new LiveErrorStateMatcher();
  currentProject: Project;
  destroyed$: Subject<boolean> = new Subject<boolean>();
  projectIndices: ProjectIndex[] = [];
  projectFields: ProjectIndex[];
  // tslint:disable-next-line:no-any
  CRFOptions: any;
  embeddings: Embedding[];

  constructor(private dialogRef: MatDialogRef<CreateCRFExtractorDialogComponent>,
              private projectService: ProjectService,
              @Inject(MAT_DIALOG_DATA) public data: { cloneElement: CRFExtractor },
              private cRFExtractorService: CRFExtractorService,
              private embeddingService: EmbeddingsService,
              private logService: LogService,
              private projectStore: ProjectStore) {
  }

  ngOnInit(): void {
    this.projectStore.getCurrentProject().pipe(takeUntil(this.destroyed$), mergeMap(currentProject => {
      if (currentProject) {
        this.currentProject = currentProject;
        return forkJoin({
          options: this.cRFExtractorService.getCRFExtractorOptions(currentProject.id),
          embeddings: this.embeddingService.getEmbeddings(currentProject.id),
          projectIndices: this.projectStore.getProjectIndices().pipe(take(1)),
        });
      } else {
        return of(null);
      }
    })).subscribe(resp => {
      if (resp?.options && !(resp.options instanceof HttpErrorResponse)) {
        this.CRFOptions = resp.options;
        this.setDefaultFormValues(this.CRFOptions);
      }
      if (resp?.embeddings && !(resp.embeddings instanceof HttpErrorResponse)) {
        this.embeddings = resp.embeddings.results;
        if (this.data?.cloneElement?.embedding) {
          const foundEmbedding = this.embeddings.find(x => x.id === this.data.cloneElement.embedding);
          if (foundEmbedding) {
            this.CRFExtractorForm.get('embeddingFormControl')?.setValue(foundEmbedding);
          }
        }
      }

      if (resp?.projectIndices && !(resp.projectIndices instanceof HttpErrorResponse)) {
        this.projectIndices = resp.projectIndices;
        if (this.data.cloneElement) {
          const indexInstances = resp.projectIndices.filter(x => this.data.cloneElement.indices.some(y => y.name === x.index));
          const indicesForm = this.CRFExtractorForm.get('indicesFormControl');
          indicesForm?.setValue(indexInstances);
          this.indicesOpenedChange(false); // refreshes the field and fact selection data
          const fieldsForm = this.CRFExtractorForm.get('mlpFieldsFormControl');
          fieldsForm?.setValue(this.data.cloneElement.mlp_field);
        }
      }
      UtilityFunctions.logForkJoinErrors(resp, HttpErrorResponse, this.logService.snackBarError);
    });

    this.projectStore.getSelectedProjectIndices().pipe(takeUntil(this.destroyed$)).subscribe(currentProjIndices => {
      if (this.currentProject?.id && currentProjIndices && !this.data.cloneElement) {
        const indicesForm = this.CRFExtractorForm.get('indicesFormControl');
        indicesForm?.setValue(currentProjIndices);
        this.projectFields = ProjectIndex.cleanProjectIndicesFields(currentProjIndices, ['mlp'], []);
      }
    });
  }

  onSubmit(formData: OnSubmitParams): void {
    const body = {
      description: formData.descriptionFormControl,
      indices: formData.indicesFormControl.map(x => [{name: x.index}]).flat(),
      mlp_field: formData.mlpFieldsFormControl,
      ...this.query ? {query: this.query} : {},
      window_size: formData.windowSizeFormControl,
      test_size: formData.testSizeFormControl,
      num_iter: formData.numIterFormControl,
      c_values: formData.cValuesFormControl.split(',').map(x => +x),
      bias: formData.biasFormControl,
      suffix_len: formData.suffixLenFormControl.split(',').map(x => +x),
      ...formData.labelsFormControl ? {labels: formData.labelsFormControl} : {},
      ...formData.featureFieldsFormControl ? {feature_fields: formData.featureFieldsFormControl.map(x => x.value)} : {},
      ...formData.contextFeatureFieldsFormControl ? {context_feature_fields: formData.contextFeatureFieldsFormControl.map(x => x.value)} : {},
      ...formData.featureExtractorsFormControl ? {feature_extractors: formData.featureExtractorsFormControl.map(x => x.value)} : {},
      embedding: formData.embeddingFormControl ? formData.embeddingFormControl.id : null,
    };

    this.cRFExtractorService.createCRFExtractorTask(this.currentProject.id, body).subscribe(resp => {
      if (resp && !(resp instanceof HttpErrorResponse)) {
        this.logService.snackBarMessage(`Created new task: ${resp.description}`, 2000);
        this.dialogRef.close(resp);
      } else {
        this.logService.snackBarError(resp, 5000);
      }
    });
  }

  public indicesOpenedChange(opened: unknown): void {
    const indicesForm = this.CRFExtractorForm.get('indicesFormControl');
    // true is opened, false is closed, when selecting something and then deselecting it the formcontrol returns empty array
    if (!opened && indicesForm?.value && !UtilityFunctions.arrayValuesEqual(indicesForm?.value, this.projectFields, (x => x.index))) {
      this.projectFields = ProjectIndex.cleanProjectIndicesFields(indicesForm.value, ['mlp'], []);
    }
  }

  onQueryChanged(query: string): void {
    this.query = query ? query : this.defaultQuery;
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }


  // tslint:disable-next-line:no-any
  setDefaultFormValues(options: any): void {
    const featureFields = this.CRFExtractorForm.get('featureFieldsFormControl');
    if (featureFields) {
      if (this.data?.cloneElement?.feature_fields) {
        const val = options.actions.POST.feature_fields.choices.filter((x: { display_name: string; }) => this.data.cloneElement.feature_fields.includes(x.display_name));
        featureFields.setValue(val);
      } else {
        featureFields.setValue(options.actions.POST.feature_fields.choices);
      }
    }
    const contextFeatureFields = this.CRFExtractorForm.get('contextFeatureFieldsFormControl');
    if (contextFeatureFields) {
      if (this.data?.cloneElement?.context_feature_fields) {
        const val = options.actions.POST.context_feature_fields.choices.filter((x: { display_name: string; }) => this.data.cloneElement.context_feature_fields.includes(x.display_name));
        contextFeatureFields.setValue(val);
      } else {
        contextFeatureFields.setValue(options.actions.POST.context_feature_fields.choices);
      }
    }
    const featureExtractors = this.CRFExtractorForm.get('featureExtractorsFormControl');
    if (featureExtractors) {
      if (this.data?.cloneElement?.feature_extractors) {
        const val = options.actions.POST.feature_extractors.choices.filter((x: { display_name: string; }) => this.data.cloneElement.feature_extractors.includes(x.display_name));
        featureExtractors.setValue(val);
      } else {
        featureExtractors.setValue(options.actions.POST.feature_extractors.choices);
      }
    }

    const labelForm = this.CRFExtractorForm.get('labelsFormControl');
    if (labelForm) {
      if (this.data?.cloneElement?.labels) {
        labelForm.setValue(this.data?.cloneElement?.labels);
      } else {
        labelForm.setValue(['GPE', 'ORG', 'PER', 'LOC']);
      }
    }

  }

}
