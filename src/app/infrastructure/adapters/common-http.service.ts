import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommonHttpService {
  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la petición HTTP:', error);
    return throwError(() => error);
  }

  get<T>(url: string, options?: object): Observable<T> {
    return this.http.get<T>(url, options).pipe(
      catchError(this.handleError)
    );
  }

  post<T>(url: string, body: any, options?: object): Observable<T> {
    return this.http.post<T>(url, body, options).pipe(
      catchError(this.handleError)
    );
  }

  put<T>(url: string, body: any, options?: object): Observable<T> {
    return this.http.put<T>(url, body, options).pipe(
      catchError(this.handleError)
    );
  }

  delete<T>(url: string, options?: object): Observable<T> {
    return this.http.delete<T>(url, options).pipe(
      catchError(this.handleError)
    );
  }
}
