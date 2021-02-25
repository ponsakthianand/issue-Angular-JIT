import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DfxUrl } from 'src/app/routes/name.routes';
import { GlobalConstants } from '../global/globalConstants';

@Injectable({
  providedIn: 'root'
})
export class OverviewService {
  private apiURL = DfxUrl.KibanaAPI;

  constructor(private http: HttpClient) {}
  // To get Search Result
  getOverviewData(postData: any): Observable<any> {
    return this.http.post<any>(
      this.apiURL + '_search?track_total_hits=true',
      postData, GlobalConstants.httpOptionsES
    );
  }
}
