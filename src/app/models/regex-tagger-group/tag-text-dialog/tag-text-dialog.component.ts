import {Component, Inject, OnInit} from '@angular/core';
import {ErrorStateMatcher} from '@angular/material/core';
import {LiveErrorStateMatcher} from '../../../shared/CustomerErrorStateMatchers';
import {Field, ProjectIndex} from '../../../shared/types/Project';
import {RegexTaggerGroupService} from '../../../core/models/taggers/regex-tagger-group/regex-tagger-group.service';
import {LogService} from '../../../core/util/log.service';
import {ProjectStore} from '../../../core/projects/project.store';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Match, RegexTaggerGroup, TagTextResult} from '../../../shared/types/tasks/RegexTaggerGroup';
import {filter, take} from 'rxjs/operators';
import {UtilityFunctions} from '../../../shared/UtilityFunctions';
import {HttpErrorResponse} from '@angular/common/http';


@Component({
  selector: 'app-tag-text-dialog',
  templateUrl: './tag-text-dialog.component.html',
  styleUrls: ['./tag-text-dialog.component.scss']
})
export class TagTextDialogComponent implements OnInit {
  result: TagTextResult;
  distinctMatches: Match[];
  isLoading = false;
  model: { text: string } = {text: ''};
  uniqueFacts: { fact: Match, textColor: string, backgroundColor: string }[] = [];
  defaultColors = [
    {backgroundColor: '#9FC2BA', textColor: 'black'},
    {backgroundColor: '#DDB0A0', textColor: 'black'},
    {backgroundColor: '#ffb2ff', textColor: 'black'},
    {backgroundColor: '#CABD80', textColor: 'black'},
    {backgroundColor: '#8f9bff', textColor: 'black'},
    {backgroundColor: '#75a7ff', textColor: 'black'},
    {backgroundColor: '#ff867f', textColor: 'black'},
    {backgroundColor: '#9fffe0', textColor: 'black'}];
  colorMap: Map<string, { backgroundColor: string, textColor: string }> = new Map();

  constructor(private regexTaggerGroupService: RegexTaggerGroupService, private logService: LogService,
              @Inject(MAT_DIALOG_DATA) public data: { currentProjectId: number, tagger: RegexTaggerGroup; }) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.data.currentProjectId && this.data.tagger) {
      this.isLoading = true;
      const body = {
        text: this.model.text
      };
      this.regexTaggerGroupService.tagText(this.data.currentProjectId, this.data.tagger.id, body).subscribe(x => {
        if (x && !(x instanceof HttpErrorResponse)) {
          this.result = x;
          this.distinctMatches = UtilityFunctions.getDistinctByProperty(this.result.matches, (y => y.str_val));
          this.uniqueFacts = [];
          const uniques = UtilityFunctions.getDistinctByProperty(this.result.matches, (y => y.fact));
          this.colorMap = new Map();
          for (let i = 0; i < uniques.length; i++) {
            if (i < this.defaultColors.length) {
              const color = this.defaultColors[i];
              this.colorMap.set(uniques[i].fact, color);
              this.uniqueFacts.push({
                fact: uniques[i],
                backgroundColor: color.backgroundColor,
                textColor: color.textColor
              });
            } else {
              const color = {
                // tslint:disable-next-line:no-bitwise
                backgroundColor: `hsla(${~~(360 * Math.random())},70%,70%,0.8)`,
                textColor: 'black'
              };
              this.colorMap.set(uniques[i].fact, color);
              this.uniqueFacts.push({
                fact: uniques[i],
                backgroundColor: color.backgroundColor,
                textColor: color.textColor
              });
            }
          }
        } else if (x) {
          this.logService.snackBarError(x);
        }
        this.isLoading = false;
      });
    }
  }
}
