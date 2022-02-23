import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  requestAuthToken(formData: FormGroup) {
    return this.http.post(`${environment.apiBaseUrl}/auth/token`, formData);
  }

  validateAuthToken(authToken: Object) {
    return this.http.get(`${environment.apiBaseUrl}/auth/validate-token`, authToken)
  }


}
