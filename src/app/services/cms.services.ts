import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DfxUrl } from 'src/app/routes/name.routes';

@Injectable({
  providedIn: 'root'
})
export class CmsService {
  private APIurl = DfxUrl.cmsAPI;

  constructor(private http: HttpClient) { }

  // Post Client Setup
  postClientData(data: any): Observable<any> {
    return this.http.post<any>(this.APIurl + 'CreateClientSetup', data);
  }
  // Post Client Setup
  postBankAccountData(data: any): Observable<any> {
    return this.http.post<any>(this.APIurl + 'NavOneCreateBankAccount ', data);
  }
  // Post Client Setup
  postEntityCreationData(data: any): Observable<any> {
    return this.http.post<any>(this.APIurl + 'NavOneEntityCreation', data);
  }

  getCurrencyCode(): Observable<any> {
    return this.http.get<any>(this.APIurl + 'GetCurrencyCode ');
  }
  getDimentionCode(value: any): Observable<any> {
    return this.http.get<any>(this.APIurl + 'GetDimentionCode?CodeType=' + value);
  }
  getClientType(): Observable<any> {
    return this.http.get<any>(this.APIurl + 'GetClientType');
  }
  getFirstPartionCode(): Observable<any> {
    return this.http.get<any>(this.APIurl + 'GetFirstPartionCode');
  }
  getCountry(): Observable<any> {
    return this.http.get<any>(this.APIurl + 'GetCountry');
  }
  getProfession(): Observable<any> {
    return this.http.get<any>(this.APIurl + 'GetProfession');
  }
  getClientLookup(): Observable<any> {
    return this.http.get<any>(this.APIurl + 'GetClientLookup');
  }
  getBankCode(): Observable<any> {
    return this.http.get<any>(this.APIurl + 'GetBankCode');
  }
  getPostingGroup(): Observable<any> {
    return this.http.get<any>(this.APIurl + 'GetPostingGroup');
  }

}
