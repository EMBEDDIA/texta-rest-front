import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {AppConfigService} from '../../util/app-config.service';
import {LogService} from '../../util/log.service';
import {ResultsWrapper} from '../../../shared/types/Generic';
import {Annotator} from '../../../shared/types/tasks/Annotator';

@Injectable({
  providedIn: 'root'
})
export class AnnotatorService {
  apiUrl = AppConfigService.settings.apiHost + AppConfigService.settings.apiBasePath;

  constructor(private http: HttpClient,
              private logService: LogService) {
  }

  getAnnotatorTasks(projectId: number, params = ''): Observable<ResultsWrapper<Annotator> | HttpErrorResponse> {
    return this.http.get<ResultsWrapper<Annotator>>(`${this.apiUrl}/projects/${projectId}/annotator/?${params}`).pipe(
      tap(e => this.logService.logStatus(e, 'getAnnotatorTasks')),
      catchError(this.logService.handleError<ResultsWrapper<Annotator>>('getAnnotatorTasks')));
  }

  createAnnotatorTask(projectId: number, body: unknown): Observable<Annotator | HttpErrorResponse> {
    return this.http.post<Annotator>(`${this.apiUrl}/projects/${projectId}/annotator/`, body).pipe(
      tap(e => this.logService.logStatus(e, 'createAnnotatorTask')),
      catchError(this.logService.handleError<Annotator>('createAnnotatorTask')));
  }

  bulkDeleteAnnotatorTasks(projectId: number, body: unknown): Observable<{ 'num_deleted': number, 'deleted_types': { string: number }[] } | HttpErrorResponse> {
    return this.http.post<{ 'num_deleted': number, 'deleted_types': { string: number }[] }>
    (`${this.apiUrl}/projects/${projectId}/annotator/bulk_delete/`, body).pipe(
      tap(e => this.logService.logStatus(e, 'bulkDeleteAnnotatorTasks')),
      catchError(this.logService.handleError<{ 'num_deleted': number, 'deleted_types': { string: number }[] }>('bulkDeleteAnnotatorTasks')));
  }
}
