import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DfxUrl } from 'src/app/routes/name.routes';
import { GlobalConstants } from '../global/globalConstants';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiURL = DfxUrl.SearchAPI;

  constructor(private http: HttpClient) {}
  // To get Search Result
  getSearchResult(postData: any): Observable<any> {
    return this.http.post<any>(
      this.apiURL + '_search?track_total_hits=true',
      postData, GlobalConstants.httpOptionsES
    );
  }
  getAutoSuggestionResult(postData: any): Observable<any> {
    return this.http.post<any>(
      this.apiURL + 'job2_3feb/_search',
      postData
    );
  }
}
