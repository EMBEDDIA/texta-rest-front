import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {ElasticsearchQuery, TextConstraint} from '../../Constraints';
import {FormControl} from '@angular/forms';
import {pairwise, startWith, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {Lexicon} from '../../../../../shared/types/Lexicon';
import {MatMenuTrigger} from '@angular/material/menu';

// tslint:disable:variable-name
@Component({
  selector: 'app-text-constraints',
  templateUrl: './text-constraints.component.html',
  styleUrls: ['./text-constraints.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextConstraintsComponent implements OnInit, OnDestroy {
  @Input() elasticSearchQuery: ElasticsearchQuery;
  @Output() constraintChanged = new EventEmitter<ElasticsearchQuery>(); // search as you type, emit changes
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  destroyed$: Subject<boolean> = new Subject<boolean>();
  // tslint:disable-next-line:no-any
  constraintQuery: any;
  // so i dont have to rename everything if i decide to refactor something
  textAreaFormControl: FormControl = new FormControl();
  slopFormControl: FormControl = new FormControl();
  matchFormControl: FormControl = new FormControl();
  operatorFormControl: FormControl = new FormControl();
  lexicons: Lexicon[] = [];

  constructor() {

  }

  public _textConstraint: TextConstraint;

  @Input() set textConstraint(value: TextConstraint) {
    if (value) {
      this._textConstraint = value;
      this.textAreaFormControl = this._textConstraint.textAreaFormControl;
      this.slopFormControl = this._textConstraint.slopFormControl;
      this.matchFormControl = this._textConstraint.matchFormControl;
      this.operatorFormControl = this._textConstraint.operatorFormControl;
      if (this._textConstraint.lexicons) {
        this.lexicons = this._textConstraint.lexicons;
      }
    }
  }

  ngOnInit(): void {
    if (this._textConstraint) {
      // multi line textarea, 1 formequery entry for each line
      // tslint:disable-next-line:no-any
      const formQueries: any[] = [];
      const multiMatchBlueprint = {
        multi_match: {
          query: '',
          type: this.matchFormControl.value,
          slop: this.slopFormControl.value,
          fields: this._textConstraint.fields.map(x => x.path)
        }
      };

      this.constraintQuery = {
        bool: {
          [this.operatorFormControl.value]: formQueries
        }
      };
      // todo fix in TS 3.7
      // tslint:disable-next-line:no-non-null-assertion
      this.elasticSearchQuery!.elasticSearchQuery!.query!.bool!.should.push(this.constraintQuery);
      this.textAreaFormControl.valueChanges.pipe(
        takeUntil(this.destroyed$), // pairwise so i can avoid emitting when new constraint, startwith for building query when savedsearch
        startWith(this.textAreaFormControl.value as object, this.textAreaFormControl.value as object), pairwise()).subscribe(value => {
        if (this.matchFormControl.value === 'regexp') {
          this.buildRegexQuery(formQueries, value[1], this._textConstraint.fields.map(x => x.path));
        } else {
          this.buildTextareaMultiMatchQuery(formQueries, value[1], multiMatchBlueprint);
        }
        if (value[0] !== value[1]) {
          this.constraintChanged.emit(this.elasticSearchQuery);
        }
      });

      this.matchFormControl.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(value => {
        multiMatchBlueprint.multi_match.type = value;
        // update deep copy multi_match clauses
        if (this.textAreaFormControl.value && this.textAreaFormControl.value.length > 0) {
          if (value === 'regexp') {
            this.buildRegexQuery(formQueries, this.textAreaFormControl.value, this._textConstraint.fields.map(x => x.path));
          } else {
            this.buildTextareaMultiMatchQuery(formQueries, this.textAreaFormControl.value, multiMatchBlueprint);
          }
        }
        if (value === 'regexp') {
          this.slopFormControl.disable(); // cant have slop in regexp
        } else {
          this.slopFormControl.enable();
        }
        this.constraintChanged.emit(this.elasticSearchQuery);
      });

      this.operatorFormControl.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe((value: string) => {
        this.constraintQuery.bool = {[value]: formQueries};
        this.constraintChanged.emit(this.elasticSearchQuery);
      });

      this.slopFormControl.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(value => {
        multiMatchBlueprint.multi_match.slop = value;
        // update slop
        if (this.textAreaFormControl.value && this.textAreaFormControl.value.length > 0) {
          this.buildTextareaMultiMatchQuery(formQueries, this.textAreaFormControl.value, multiMatchBlueprint);
        }
        this.constraintChanged.emit(this.elasticSearchQuery);
      });

      // todo

    }
  }

  buildRegexQuery(formQueries: unknown[], formValue: string, fields: string[]): void {
// gonna rebuild formqueries so delete previous
    formQueries.splice(0, formQueries.length);
    const textareaValues = this.stringToArray(formValue, '\n');

    if (textareaValues.length > 0) {
      for (const line of textareaValues) {
        // tslint:disable-next-line:no-any
        const newFormQuery: any = {
          bool: {
            should: [],
            minimum_should_match: 1
          }
        };
        // tslint:disable-next-line:no-any
        const regexQuery: any = {
          regexp: {}
        };
        for (const field of fields) {
          regexQuery.regexp[field] = line;
        }
        newFormQuery.bool.should.push(regexQuery);
        formQueries.push(newFormQuery);
      }
    }
  }

  // every newline in textarea is a new multi_match clause
  buildTextareaMultiMatchQuery(formQueries: unknown[],
                               formValue: string,
                               multiMatchBlueprint: {
                                 multi_match: {
                                   query: string; type: string; slop: number; fields: string[];
                                 };
                               }): void {
    // gonna rebuild formqueries so delete previous
    formQueries.splice(0, formQueries.length);
    const textareaValues = this.stringToArray(formValue, '\n');
    if (textareaValues.length > 0) {
      for (const line of textareaValues) {
        // tslint:disable-next-line:no-any
        const newFormQuery: any = {
          bool: {
            should: [],
            minimum_should_match: 1
          }
        };
        // json for deep copy because i need to also delete clauses when newline is deleted, cant have shallow copies
        const deepCloneMultiMatchBluePrint = JSON.parse(JSON.stringify(multiMatchBlueprint));
        deepCloneMultiMatchBluePrint.multi_match.query = line;
        newFormQuery.bool.should.push(deepCloneMultiMatchBluePrint);
        formQueries.push(newFormQuery);
      }
    }
  }

  public addLexicon(val: Lexicon): void {
    const formControlValue = this.textAreaFormControl.value as string;
    let phrases = '';
    if (val.phrases) {
      val.phrases.forEach(x => {
        phrases += x + '\n';
      });
    }
    if (formControlValue.endsWith('\n') || formControlValue === '') {
      this.textAreaFormControl.setValue(formControlValue + phrases);
    } else {
      this.textAreaFormControl.setValue(formControlValue + '\n' + phrases);
    }
    this.trigger.closeMenu();
  }

  ngOnDestroy(): void {
    console.log('destroy text-constraint');
    // todo fix in TS 3.7
    // tslint:disable-next-line:no-non-null-assertion
    const index = this.elasticSearchQuery!.elasticSearchQuery!.query!.bool!.should.indexOf(this.constraintQuery, 0);
    if (index > -1) {
      // todo fix in TS 3.7
      // tslint:disable-next-line:no-non-null-assertion
      this.elasticSearchQuery!.elasticSearchQuery!.query!.bool!.should!.splice(index, 1);
    }
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  private stringToArray(stringToSplit: string, splitBy: string): string[] {
    const stringList = stringToSplit.split(splitBy);
    // filter out empty values
    return stringList.filter(x => x !== '');
  }

}
