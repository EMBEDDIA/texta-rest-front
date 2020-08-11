import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {TorchTagger} from '../../../shared/types/tasks/TorchTagger';
import {LogService} from '../../util/log.service';
import {Observable} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {ResultsWrapper} from '../../../shared/types/Generic';

@Injectable({
  providedIn: 'root'
})
export class TorchTaggerService {
  apiUrl = environment.apiHost + environment.apiBasePath;

  constructor(private http: HttpClient, private logService: LogService) {
  }

  getTorchTaggers(projectId: number, params = ''): Observable<ResultsWrapper<TorchTagger> | HttpErrorResponse> {
    return this.http.get<ResultsWrapper<TorchTagger>>(`${this.apiUrl}/projects/${projectId}/torchtaggers/?${params}`,
    ).pipe(
      tap(e => this.logService.logStatus(e, 'getTorchTaggers')),
      catchError(this.logService.handleError<ResultsWrapper<TorchTagger>>('getTorchTaggers')));
  }

  editTorchTagger(body: unknown, projectId: number, taggerId: number): Observable<TorchTagger | HttpErrorResponse> {
    return this.http.patch<TorchTagger>(
      `${this.apiUrl}/projects/${projectId}/torchtaggers/${taggerId}/`, body
    ).pipe(
      tap(e => this.logService.logStatus(e, 'editTorchTagger')),
      catchError(this.logService.handleError<TorchTagger>('editTorchTagger')));
  }

  bulkDeleteTorchTaggers(projectId: number, body: unknown): Observable<unknown> {
    return this.http.post<{ 'num_deleted': number, 'deleted_types': { string: number }[] }>
    (`${this.apiUrl}/projects/${projectId}/torchtaggers/bulk_delete/`, body).pipe(
      tap(e => this.logService.logStatus(e, 'bulkDeleteTorchTaggers')),
      catchError(this.logService.handleError<unknown>('bulkDeleteTorchTaggers')));
  }

  deleteTorchTagger(projectId: number, taggerId: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/projects/${projectId}/torchtaggers/${taggerId}`).pipe(
      tap(e => this.logService.logStatus(e, 'deleteTorchTagger')),
      catchError(this.logService.handleError<unknown>('deleteTorchTagger')));
  }


  getTorchTaggerOptions(projectId: number): Observable<unknown> {
    return this.http.options<unknown>(`${this.apiUrl}/projects/${projectId}/torchtaggers/`).pipe(
      tap(e => this.logService.logStatus(e, 'getTorchTaggerOptions')),
      catchError(this.logService.handleError<unknown>('getTorchTaggerOptions')));
  }

  createTorchTagger(projectId: number, payload: unknown): Observable<TorchTagger> {
    return this.http.post<TorchTagger>(`${this.apiUrl}/projects/${projectId}/torchtaggers/`, payload).pipe(
      tap(e => this.logService.logStatus(e, 'createTorchTagger')),
      catchError(this.logService.handleError<TorchTagger>('createTorchTagger')));
  }

  tagText(body: unknown, projectId: number, taggerId: number): Observable<{ result: boolean, probability: number }  | HttpErrorResponse> {
    return this.http.post<{ result: boolean, probability: number } >(`${this.apiUrl}/projects/${projectId}/torchtaggers/${taggerId}/tag_text/`, body).pipe(
      tap(e => this.logService.logStatus(e, 'tagTorchText')),
      catchError(this.logService.handleError<{ result: boolean, probability: number } >('tagTorchText')));
  }
}
