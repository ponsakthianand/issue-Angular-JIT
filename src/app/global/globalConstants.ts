import { HttpHeaders } from '@angular/common/http';

export class GlobalConstants {

  public static httpOptionsES = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // Authorization: 'Basic ' + btoa('admin:welcome2dfx')
    })
  };

}
