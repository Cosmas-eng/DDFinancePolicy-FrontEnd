import { PolicyToTable } from '../models';
import { Observable, ReplaySubject } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';

export class PolicyDataSourceService extends DataSource<PolicyToTable> {
  private _dataStream = new ReplaySubject<PolicyToTable[]>(1)

  constructor(initialData: PolicyToTable[]) { 
    super();
    this._dataStream.next(initialData);
  }

  override connect(): Observable<readonly PolicyToTable[]> {
    return this._dataStream;
  }
  override disconnect(): void {
  }

  updateData(data: PolicyToTable[]): void {
    this._dataStream.next(data);
  }
}
