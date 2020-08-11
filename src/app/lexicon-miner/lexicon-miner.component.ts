import {Component, OnDestroy, OnInit} from '@angular/core';
import {of, Subject} from 'rxjs';
import {Lexicon} from '../shared/types/Lexicon';
import {LogService} from '../core/util/log.service';
import {LexiconService} from '../core/lexicon/lexicon.service';
import {ProjectStore} from '../core/projects/project.store';
import {switchMap, takeUntil} from 'rxjs/operators';
import {Project} from '../shared/types/Project';
import {HttpErrorResponse} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../shared/components/dialogs/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-lexicon-miner',
  templateUrl: './lexicon-miner.component.html',
  styleUrls: ['./lexicon-miner.component.scss']
})
export class LexiconMinerComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  lexicons: Lexicon[] = [];
  newLexiconDescription = '';
  selectedLexicon: Lexicon | null;
  currentProject: Project;
  pageSize = 30;
  totalLexicons: number;

  constructor(private logService: LogService, private dialog: MatDialog,
              private lexiconService: LexiconService, private projectStore: ProjectStore) {
  }

  ngOnInit(): void {
    // you need both lexicons and embeddings to use lexicon miner, so just forkjoin if one of them errors cant do anything
    this.projectStore.getCurrentProject().pipe(takeUntil(this.destroy$), switchMap(currentProject => {
      if (currentProject) {
        this.currentProject = currentProject;
        return this.lexiconService.getLexicons(
          currentProject.id,
          `page=1&page_size=${this.pageSize}`
        );
      }
      return of(null);
    })).subscribe(resp => {
        if (resp) {
          if (resp instanceof HttpErrorResponse) {
            this.logService.snackBarError(resp, 5000);
          } else {
            this.selectedLexicon = null;
            this.totalLexicons = resp.count;
            this.lexicons = resp.results;
          }
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  createNewLexicon(): void {
    if (this.currentProject) {
      this.lexiconService.createLexicon({
          description: this.newLexiconDescription,
          phrases: []
        }, this.currentProject.id
      ).subscribe(resp => {
        if (resp instanceof HttpErrorResponse) {
          this.logService.snackBarError(resp, 5000);
        } else {
          this.lexicons.push(resp);
          this.logService.snackBarMessage(`Created lexicon ${resp.description}`, 2000);
        }
        this.projectStore.refreshSelectedProjectResourceCounts();
        this.newLexiconDescription = '';
      });
    }
  }

  deleteLexicon(lexicon: Lexicon): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {confirmText: 'Delete', mainText: `Are you sure you want to delete this Lexion?`}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        return this.lexiconService.deleteLexicon(this.currentProject.id, lexicon.id)
          .subscribe((resp: Lexicon | HttpErrorResponse) => {
            if (resp instanceof HttpErrorResponse) {
              this.logService.snackBarError(resp, 5000);
            } else {
              this.logService.snackBarMessage(`Deleted lexicon ${lexicon.description}`, 3000);
              const position = this.lexicons.findIndex(x => x.id === lexicon.id);
              this.lexicons.splice(position, 1);
              // update lexicon count in navbar
              this.projectStore.refreshSelectedProjectResourceCounts();
            }
          });
      }
    });
  }

  selectLexicon(lexicon: Lexicon): void {
    if (this.selectedLexicon !== lexicon) {
      this.selectedLexicon = lexicon;
    }
  }

  onScrollLexicons(): void {
    if (this.currentProject && this.lexicons.length < this.totalLexicons) {
      this.lexiconService.getLexicons(
        this.currentProject.id,
        `page=${Math.round(this.lexicons.length / this.pageSize) + 1}&page_size=${this.pageSize}`)
        .subscribe(resp => {
          if (resp instanceof HttpErrorResponse) {
            this.logService.snackBarError(resp, 2000);
          } else if (resp) {
            this.totalLexicons = resp.count;
            this.lexicons = [...this.lexicons, ...resp.results];
          }
        });
    }
  }
}
