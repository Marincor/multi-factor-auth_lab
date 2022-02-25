import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { totp } from 'otplib/v11';
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

  mockValidateAuthToken(formParams: any) {
    console.log("formParams", formParams)
     return this.http.get(`http://localhost:3000/authToken?${formParams}`)
    // return this.http.get(`http://localhost:3000/authToken?generatedToken=${authToken}&email=${email}`)
  }

  mockRequestAuthToken(formData: any){
    console.log('formdata', formData)
    let form = {
      email: formData.email,
      password: formData.password,
      generatedToken: Math.round( Math.random() * 666666)
    }
    return this.http.post(`http://localhost:3000/authToken`, form);
  }

  // google auth //

    mockRequestGoogleAuthToken(params: AuthTokenGoogleParams) {
      return this.http.post(`http://localhost:3000/authGoogleGenerate`, params);
    }

    mockRequestValidateGoogleAuthToken(params: any){

    // real world //
    console.log(params.token);
    console.log(params.secret)
       return totp.verify({
          secret: params.secret,
          token: params.token
        })


    // fake response //


    }


}

interface AuthTokenGoogleParams {
  id: string;
  temp_secret?: string;
  secret?:string;
}
