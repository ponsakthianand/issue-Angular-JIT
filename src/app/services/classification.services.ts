import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DfxUrl } from 'src/app/routes/name.routes';

@Injectable({
  providedIn: 'root'
})
export class ClassificationService {
  private apiURL = DfxUrl.ClassificationAPI;
  private docuviewerURL = DfxUrl.DocuviewerAPI;
  public shown = false;

  constructor(private http: HttpClient) {}
  // Read models list from API
  readModelsList(): Observable<any> {
    return this.http.get<any>(this.apiURL + '/models');
  }
  // Read models list from API
  readModelsListDb(): Observable<any> {
    return this.http.get<any>(this.apiURL + '/db/models');
  }
  // Read models data from API
  readModelData(model: any, parent: any): Observable<any> {
    return this.http.get<any>(this.apiURL + '/model/' + model + '/' + parent);
  }
  // Read Groups list from API
  readGroupsList(): Observable<any> {
    return this.http.get<any>(this.apiURL + '/groups');
  }
  // Read Group's Random docs from API
  readGroupsDocsList(groupID): Observable<any> {
    return this.http.get<any>(this.apiURL + '/group/documents/' + groupID);
  }
  // Read Training Groups list from API
  readTrainingGroupsList(): Observable<any> {
    return this.http.get<any>(this.apiURL + '/groups/discovered');
  }
  // Read Publish Groups list from API
  readPublishGroupsList(): Observable<any> {
    return this.http.get<any>(this.apiURL + '/groups/trained');
  }
  // Read Training Status from API
  trainingStatus(): Observable<any> {
    return this.http.get<any>(this.apiURL + '/trainstatus');
  }
  // Read Publish Status from API
  publishList(): Observable<any> {
    return this.http.get<any>(this.apiURL + '/publishstatus');
  }
  // Read models subtype from API
  getModelSubType(): Observable<any> {
    return this.http.get<any>(this.apiURL + '/model_list');
  }
  // Read models subtype doc from API
  readModelSubTypeDoc(modelID: any, subModelID: any): Observable<any> {
    return this.http.get<any>(
      this.apiURL + '/model/documents/' + modelID + '/' + subModelID
    );
  }
  // create models list from API
  saveModel(modelData: any): Observable<any> {
    return this.http.post<any>(this.apiURL + '/buildmodel', modelData);
  }
  // Update models list from API
  updateModel(modelData: any): Observable<any> {
    return this.http.post<any>(this.apiURL + '/regeneratemodel', modelData);
  }
  // Revoke Existing model from API
  revokeModel(modelID): Observable<any> {
    return this.http.post<any>(this.apiURL + '/groups/revoke', modelID);
  }
  // Revoke Existing model from API
  trainingModel(models): Observable<any> {
    return this.http.put<any>(this.apiURL + '/group/train', models);
  }

  publishModel(models): Observable<any> {
    return this.http.post<any>(this.apiURL + '/groups/publish', models);
  }
  
  getFile(file) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/json');
      this.http.post(this.docuviewerURL, file, { headers: headers,observe: "response" as 'body',responseType: "blob" }).subscribe((res: any) => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }
}
