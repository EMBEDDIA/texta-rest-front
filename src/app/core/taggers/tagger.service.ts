import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {LocalStorageService} from '../util/local-storage.service';
import {LogService} from '../util/log.service';
import {Observable} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Tagger} from '../../shared/types/Tagger';
import {TaggerOptions} from '../../shared/types/TaggerOptions';


@Injectable({
  providedIn: 'root'
})
export class TaggerService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private localStorageService: LocalStorageService,
              private logService: LogService) {
  }

  getTaggers(projectId: number): Observable<Tagger[] | HttpErrorResponse> {
    return this.http.get<Tagger[]>(
      this.apiUrl + '/projects/' + projectId + '/taggers/',
    ).pipe(
      tap(e => this.logService.logStatus(e, 'getTaggers')),
      catchError(this.logService.handleError<Tagger[]>('getTaggers')));
  }

  createTagger(body: {}, projectId: number): Observable<Tagger | HttpErrorResponse> {
    return this.http.post<Tagger>(
      this.apiUrl + '/projects/' + projectId + '/taggers/',
      body
    ).pipe(
      tap(e => this.logService.logStatus(e, 'makeTagger')),
      catchError(this.logService.handleError<Tagger>('makeTagger')));
  }

  getTaggerById(id: number, projectId: number): Observable<Tagger | HttpErrorResponse> {
    return this.http.get<Tagger>(
      this.apiUrl + '/projects/' + projectId + '/taggers/' + id,
    ).pipe(
      tap(e => this.logService.logStatus(e, 'getTaggerById')),
      catchError(this.logService.handleError<Tagger>('getTaggerById')));
  }

  // todo seperate endpoint
  getTaggerOptions(projectId: number): Observable<TaggerOptions | HttpErrorResponse> {
    return this.http.options<TaggerOptions>(
      this.apiUrl + '/projects/' + projectId + '/taggers/'
    ).pipe(
      tap(e => this.logService.logStatus(e, 'getTaggerOptions')),
      catchError(this.logService.handleError<TaggerOptions>('getTaggerOptions')));
  }
}