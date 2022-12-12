import {Component, Inject, OnInit} from '@angular/core';
import {ErrorStateMatcher} from '@angular/material/core';
import {LiveErrorStateMatcher} from '../../../shared/CustomerErrorStateMatchers';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TaggerGroup} from '../../../shared/types/tasks/Tagger';
import {ProjectStore} from '../../../core/projects/project.store';
import {filter, mergeMap, switchMap, take} from 'rxjs/operators';
import {of} from 'rxjs';
import {TaggerGroupService} from '../../../core/models/taggers/tagger-group.service';
import {LexiconService} from '../../../core/lexicon/lexicon.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Lexicon} from '../../../shared/types/Lexicon';
import {FormControl, FormGroup} from '@angular/forms';
import {Project} from '../../../shared/types/Project';
import {LogService} from '../../../core/util/log.service';

@Component({
  selector: 'app-edit-tagger-group-dialog',
  templateUrl: './edit-tagger-group-dialog.component.html',
  styleUrls: ['./edit-tagger-group-dialog.component.scss']
})
export class EditTaggerGroupDialogComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<EditTaggerGroupDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: TaggerGroup,
              private taggerGroupService: TaggerGroupService,
              private lexiconService: LexiconService,
              private logService: LogService,
              private projectStore: ProjectStore) {
    this.data = {...this.data};
  }

  taggerGroupForm = new FormGroup({
    descriptionFormControl: new FormControl(this.data?.description ?? ''),
    nerLexiconsFormControl: new FormControl(),
    useTaggersAsNerFilterFormControl: new FormControl(this.data?.use_taggers_as_ner_filter ?? true),
  });
  isLoading = false;
  currentProject: Project;
  matcher: ErrorStateMatcher = new LiveErrorStateMatcher();
  lexicons: Lexicon[] = [];

  idCompare = (o1: { id: number }, o2: { id: number }) => o1?.id === o2?.id;

  onSubmit(): void {
    this.isLoading = true;
    const formData = this.taggerGroupForm.value;
    this.taggerGroupService.editTaggerGroup({
      description: formData.descriptionFormControl,
      ner_lexicons: formData?.nerLexiconsFormControl.map((x: { id: number; }) => x.id),
      use_taggers_as_ner_filter: formData?.useTaggersAsNerFilterFormControl,
    }, this.currentProject.id, this.data.id).subscribe(resp => {
      if (resp instanceof HttpErrorResponse) {
        this.logService.snackBarError(resp);
      } else {
        this.dialogRef.close(resp);
      }
      this.isLoading = false;
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.projectStore.getCurrentProject().pipe(take(1), filter(x => !!x), switchMap(currentProject => {
      if (currentProject) {
        this.currentProject = currentProject;
        return this.lexiconService.getLexicons(currentProject.id, 'page=1&page_size=999');
      } else {
        return of(null);
      }
    })).subscribe(resp => {
      if (resp && !(resp instanceof HttpErrorResponse)) {
        this.lexicons = resp.results;
        if (this.data?.ner_lexicons) {
          const foundLexicons = this.lexicons.filter(x => this.data.ner_lexicons.includes(x.id));
          if (foundLexicons) {
            this.taggerGroupForm?.get('nerLexiconsFormControl')?.setValue(foundLexicons);
          }
        }
      }
    });
  }
}
