import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Policy, PolicyContact, PolicyForm, PolicyPremium, PolicyResponse, PolicyStatus } from '../models/index';

@Injectable()
export class PolicyService {

  private serverUrl = 'https://localhost:57679';

  constructor(private http: HttpClient) { }

  getPolicies(holder: string | null, status: number | null): Observable<PolicyResponse> {
    let params = new HttpParams();
    if (holder) {
      params = params.set('HolderSearchTerm', holder);
    }

    const numericStatus = Number(status);
    if (typeof numericStatus === 'number' && numericStatus > 0 && numericStatus <= 4) {
      params = params.set('StatusFilter', numericStatus.toString());
    }

    return this.http.get<PolicyResponse>(`${this.serverUrl}/policies`, { params: params.keys().length ? params : undefined })
      .pipe(
        catchError(this.handleError)
      );
  }

  getPolicy(id: number): Observable<Policy> {
    return this.http.get<Policy>(`${this.serverUrl}/policies/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  addPolicy(policy: PolicyForm): Observable<Policy> {
    return this.http.post<Policy>(`${this.serverUrl}/policies`, policy)
      .pipe(
        catchError(this.handleError)
      );
  }

  checkHolderIdUnique(holderId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.serverUrl}/policies/checkholderidunique`, { params: new HttpParams().set('PolicyHolderId', holderId.toString()) })
      .pipe(
        map(response => response),
        catchError(this.handleError)
      );
  }

  updatePolicyContact(policy: PolicyContact): Observable<Policy> {
    return this.http.put<Policy>(`${this.serverUrl}/policies/${policy.Id}/contact`, policy)
      .pipe(
        catchError(this.handleError)
      );
  }

  updatePolicyPremium(policy: PolicyPremium): Observable<Policy> {
    return this.http.put<Policy>(`${this.serverUrl}/policies/${policy.Id}/premium`, policy)
      .pipe(
        catchError(this.handleError)
      );
  }

  updatePolicyStatus(policy: PolicyStatus): Observable<Policy> {
    return this.http.put<Policy>(`${this.serverUrl}/policies/${policy.Id}/status`, policy)
      .pipe(
        catchError(this.handleError)
      );
  }

  deletePolicy(id: number): Observable<Policy> {
    return this.http.delete<Policy>(`${this.serverUrl}/policies/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
