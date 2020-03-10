import {Component, OnInit} from '@angular/core';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatDialogRef} from '@angular/material/dialog';
import {EmbeddingsService} from '../../../../core/models/embeddings/embeddings.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LiveErrorStateMatcher} from '../../../../shared/CustomerErrorStateMatchers';
import {mergeMap, take, takeUntil} from 'rxjs/operators';
import {of, Subject} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {ProjectStore} from '../../../../core/projects/project.store';
import {Field, Project, ProjectField} from '../../../../shared/types/Project';
import {ProjectService} from '../../../../core/projects/project.service';
import {Embedding} from '../../../../shared/types/tasks/Embedding';
import {UtilityFunctions} from '../../../../shared/UtilityFunctions';

@Component({
  selector: 'app-create-embedding-dialog',
  templateUrl: './create-embedding-dialog.component.html',
  styleUrls: ['./create-embedding-dialog.component.scss']
})
export class CreateEmbeddingDialogComponent implements OnInit {

  embeddingForm = new FormGroup({
    descriptionFormControl: new FormControl('', [
      Validators.required,
    ]),
    fieldsFormControl: new FormControl([], [Validators.required]),
    dimensionsFormControl: new FormControl(100, [Validators.required]),
    frequencyFormControl: new FormControl(5, [Validators.required])

  });
  defaultQuery = '{"query": {"match_all": {}}}';
  query = this.defaultQuery;
  matcher: ErrorStateMatcher = new LiveErrorStateMatcher();
  projectFields: ProjectField[];
  destroyed$ = new Subject<boolean>();
  fieldsUnique: Field[] = [];

  constructor(private dialogRef: MatDialogRef<CreateEmbeddingDialogComponent>,
              private projectService: ProjectService,
              private embeddingService: EmbeddingsService,
              private projectStore: ProjectStore) {
  }

  ngOnInit() {

    this.projectStore.getCurrentProjectFields().pipe(takeUntil(this.destroyed$)).subscribe(x => {
      if (x) {
        this.projectFields = ProjectField.cleanProjectFields(x, ['text'], []);
        this.fieldsUnique = UtilityFunctions.getDistinctByProperty<Field>(this.projectFields.map(y => y.fields).flat(), (y => y.path));
      }
    });
  }

  onQueryChanged(query: string) {
    this.query = query ? query : this.defaultQuery;
  }

  onSubmit(formData) {
    // temp
    const fieldsToSend = this.generateFieldsFormat(formData.fieldsFormControl);
    const body = {
      description: formData.descriptionFormControl,
      fields: fieldsToSend,
      num_dimensions: formData.dimensionsFormControl,
      min_freq: formData.frequencyFormControl
    };

    if (this.query) {
      body['query'] = this.query;
    }

    this.projectStore.getCurrentProject().pipe(take(1), mergeMap((project: Project) => {
      if (project) {
        return this.embeddingService.createEmbedding(body, project.id);
      }
      return of(null);
    })).subscribe((resp: Embedding | HttpErrorResponse) => {
      if (resp && !(resp instanceof HttpErrorResponse)) {
        console.log(resp);
        this.dialogRef.close(resp);
      } else if (resp instanceof HttpErrorResponse) {
        this.dialogRef.close(resp);
      }
    });
  }

  generateFieldsFormat(fields: Field[]) {
    const output: any[] = [];
    for (const field of fields) {
      output.push(field.path);
    }
    return output;
  }


  closeDialog(): void {
    this.dialogRef.close();
  }

}
