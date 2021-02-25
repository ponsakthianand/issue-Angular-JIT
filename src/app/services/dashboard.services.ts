import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DfxUrl } from 'src/app/routes/name.routes';
import { GlobalConstants } from '../global/globalConstants';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private APIurl = DfxUrl.DashboardAPI;

  constructor(private http: HttpClient) {}

  // Read data using _search URL from API
  searchUrl(obj: any): Observable<any> {
    return this.http.post<any>(
      this.APIurl + '_search',
      obj,
      GlobalConstants.httpOptionsES
    );
  }

  // Read data using _count URL from API
  countUrl(obj: any): Observable<any> {
    return this.http.post<any>(
      this.APIurl + '_count',
      obj,
      GlobalConstants.httpOptionsES
    );
  }

  // Read data using _search?track_total_hits=true URL from API
  trackTotalUitsUrl(obj: any): Observable<any> {
    return this.http.post<any>(
      this.APIurl + '_search?track_total_hits=true',
      obj,
      GlobalConstants.httpOptionsES
    );
  }
}
