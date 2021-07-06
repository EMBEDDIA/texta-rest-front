import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {UserProfile} from '../../shared/types/UserProfile';
import {UserStore} from '../../core/users/user.store';
import {takeUntil} from 'rxjs/operators';
import {CoreService} from '../../core/core.service';
import {HttpErrorResponse} from '@angular/common/http';
import {LogService} from '../../core/util/log.service';

@Component({
  selector: 'app-celery',
  templateUrl: './celery.component.html',
  styleUrls: ['./celery.component.scss']
})
export class CeleryComponent implements OnInit, OnDestroy {
  destroyed$ = new Subject();
  currentUser: UserProfile;
  celeryQueue: any;

  constructor(private userStore: UserStore, private coreService: CoreService, private logService: LogService) {
  }

  ngOnInit(): void {
    this.userStore.getCurrentUser().pipe(takeUntil(this.destroyed$)).subscribe(user => {
      if (user) {
        this.currentUser = user;
      }
    });
    this.coreService.getCeleryQueueStats().pipe(takeUntil(this.destroyed$)).subscribe(resp => {
      if (resp && !(resp instanceof HttpErrorResponse)) {
        this.celeryQueue = resp;
      } else if (resp) {
        this.logService.snackBarError(resp);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
