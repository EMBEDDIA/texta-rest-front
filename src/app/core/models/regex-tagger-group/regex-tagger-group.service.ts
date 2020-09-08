import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {RegexTaggerGroup} from '../../../shared/types/tasks/RegexTaggerGroup';
import {ResultsWrapper} from '../../../shared/types/Generic';
import {LogService} from '../../util/log.service';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegexTaggerGroupService {
  apiUrl = environment.apiHost + environment.apiBasePath;

  constructor(private http: HttpClient,
              private logService: LogService) {
  }

  getRegexTaggerGroupTasks(projectId: number, params = ''): Observable<ResultsWrapper<RegexTaggerGroup> | HttpErrorResponse> {
    return this.http.get<ResultsWrapper<RegexTaggerGroup>>(`${this.apiUrl}/projects/${projectId}/regex_tagger_groups/?${params}`).pipe(
      tap(e => this.logService.logStatus(e, 'getRegexTaggerGroup')),
      catchError(this.logService.handleError<ResultsWrapper<RegexTaggerGroup>>('getRegexTaggerGroup')));
  }

  createRegexTaggerGroupTask(projectId: number, body: unknown): Observable<RegexTaggerGroup | HttpErrorResponse> {
    return this.http.post<RegexTaggerGroup>(`${this.apiUrl}/projects/${projectId}/regex_tagger_groups/`, body).pipe(
      tap(e => this.logService.logStatus(e, 'createRegexTaggerGroup')),
      catchError(this.logService.handleError<RegexTaggerGroup>('createRegexTaggerGroup')));
  }

  bulkDeleteRegexTaggerGroupTasks(projectId: number, body: unknown): Observable<{ 'num_deleted': number, 'deleted_types': { string: number }[] } | HttpErrorResponse> {
    return this.http.post<{ 'num_deleted': number, 'deleted_types': { string: number }[] }>
    (`${this.apiUrl}/projects/${projectId}/regex_tagger_groups/bulk_delete/`, body).pipe(
      tap(e => this.logService.logStatus(e, 'bulkDeleteRegexTaggerGroup')),
      catchError(this.logService.handleError<{ 'num_deleted': number, 'deleted_types': { string: number }[] }>('bulkDeleteRegexTaggerGroup')));
  }
}
