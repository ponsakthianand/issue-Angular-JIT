import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DfxUrl } from 'src/app/routes/name.routes';

@Injectable({
  providedIn: 'root',
})
export class DmsService {
  private APIurl = DfxUrl.dmsAPI;

  constructor(private http: HttpClient) {}

  // Read calendar data from API
  getCalendarData(date: any, id: any): Observable<any> {
    return this.http.get<any>(
      this.APIurl + 'Calendar/GetLeaveDetailsByMonth/' + date + '/' + id
    );
  }

  // Read employee data from API
  getEmployeeData(id: any): Observable<any> {
    return this.http.post<any>(this.APIurl + 'Login/LoginByUsername', {
      userName: id,
    });
  }

  // Read laserfiche forms list from API
  getFormsList(username: any): Observable<any> {
    return this.http.post<any>(this.APIurl + 'Form/GetAllForms', {
      userName: username,
    });
  }

  // Read laserfiche forms list from API
  getFormActiveState(id: any): Observable<any> {
    return this.http.get<any>(this.APIurl + 'Form/IsOpenTask?taskid=' + id);
  }

  // Read Task List from API
  getTaskList(username: any): Observable<any> {
    return this.http.post<any>(this.APIurl + 'Form/GetOpenTaskList', {
      userName: username,
    });
  }
  // deleteLeave(entryId: any): Observable<any> {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //     }),
  //   };
  //   return this.http.post<any>(this.APIurl + 'Calendar/CancelLeave?entryId=' + entryId,httpOptions);
  // }

  getCancelLeaveUrl(entryid: any) {
    return this.http.get<any>(this.APIurl + 'Form/CancelForm/' + entryid);
  }

  getAbsenceData() {
    return this.http.get<any>(this.APIurl + 'Calendar/GetLeaveDetailsByToday');
  }
}
