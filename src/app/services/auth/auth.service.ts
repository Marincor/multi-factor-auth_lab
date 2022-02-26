import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as OTPAuth from 'otpauth';
import { makeBase32, uuidv4 } from 'src/app/infastructure/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  qrCodeFunc: QrCodeModel = require('qrcode');;
  OTPAuth: OTPAuth.TOTP = new OTPAuth.TOTP;
  authenticatedOTPAuth?: OTPAuth.TOTP;
  authTokenId: string = '';

  constructor(private http: HttpClient) { }


  // authorization token //


  requestAuthToken(formData: FormGroup) {
    return this.http.post(`${environment.apiBaseUrl}/auth/token`, formData);
  }

  validateAuthToken(authToken: Object) {
    return this.http.get(`${environment.apiBaseUrl}/auth/validate-token`, authToken)
  }


  // mock //

  mockValidateAuthToken(formParams: any) {
    console.log("formParams", formParams)
     return this.http.get(`${environment.apiBaseUrl}/authToken?${formParams}`);
  }

  mockRequestAuthToken(formData: any){
    console.log('formdata', formData)
    let form = {
      email: formData.email,
      password: formData.password,
      generatedToken: Math.round( Math.random() * 666666)
    }
    return this.http.post(`${environment.apiBaseUrl}/authToken`, form);
  }

  // google auth //


    checkAuthenticatedUSer(emailId:string) {
      return this.http.get<AuthenticatedUserModel>(`${environment.apiBaseUrl}/authGoogleAuthenticated/${emailId}`);
    }

    requestGoogleAuthToken(params: object){
      return this.http.post<AuthenticatedUserModel>(`${environment.apiBaseUrl}/authGoogleGenerate/`, params);
    }

    updateGoogleAuthToken(params: AuthTokenUserModel) {
      return  this.http.patch(`${environment.apiBaseUrl}/authGoogleGenerate/${params.id}`, params)
    }

      //  if true > backend delete temp_secret and registered it as secret (a 'permanent' secret) //
    validateGoogleAuthToken(params: ValidateTokenModel) {
      return this.http.post(`${environment.apiBaseUrl}/validateToken`, params)
    }



    // mock //



    mockCheckAuthenticatedUser(emailId:string): Observable<AuthenticatedUserModel> {
      return this.http.get<AuthenticatedUserModel>(`${environment.apiBaseUrl}/authGoogleAuthenticated/${emailId}`);
    }

    mockRequestGoogleAuthToken(email: string) {
      this.authTokenId = email;
      let code32 = makeBase32(32);
      this.OTPAuth = new OTPAuth.TOTP({
        issuer: 'MFA FACTOR', // YOUR PROJECT_NAME //
        label: email, // USER E-MAIL //
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: code32
      });

      let params = {
        id:   this.authTokenId ,
        temp_secret: this.OTPAuth.secret.base32
      }
      let otpauthQrCode = this.OTPAuth.toString();

      return this.http.post(`${environment.apiBaseUrl}/authGoogleGenerate`, params).subscribe(
        {
          next: data => {
            console.log('data mock', data)
            this.qrCodeFunc = require('qrcode');
            this.qrCodeFunc.toCanvas(document.getElementById('canvas'), otpauthQrCode, function(error: any) {
              if (error) {
                console.error(error);
                alert('erro ao gerar qrcode, recarregue a página')
              }
            });
          },
          error: error => console.log('error', error)
        }
      );
    }

    mockUpdateGoogleAuthToken(email: string) {
      this.authTokenId = email;
      let code32 = makeBase32(32);
      this.OTPAuth = new OTPAuth.TOTP({
        issuer: 'MFA FACTOR', // YOUR PROJECT_NAME //
        label: email, // USER E-MAIL //
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: code32
      });

      let params = {
        id:   this.authTokenId ,
        temp_secret: this.OTPAuth.secret.base32
      }

      let otpauthQrCode = this.OTPAuth.toString();

      return this.http.patch(`${environment.apiBaseUrl}/authGoogleGenerate/${params.id}`, params).subscribe(
        {
          next: data => {
            console.log('data mock', data)
            this.qrCodeFunc = require('qrcode');
            this.qrCodeFunc.toCanvas(document.getElementById('canvas'), otpauthQrCode, function(error: any) {

              if (error) {
                console.error(error);
                alert('erro ao gerar qrcode, recarregue a página')
              }

            });
          },
          error: error => console.log('error', error)
        }
      );
    }



    mockRequestValidateGoogleAuthToken( typedToken: string, secret? : string, email?: string){
      if(secret) {
        console.log('userAuthenticated',secret)
        this.authTokenId = email as string;
        this.authenticatedOTPAuth = new OTPAuth.TOTP({
          issuer: 'MFA FACTOR', // YOUR PROJECT_NAME //
          label: email, // USER E-MAIL //
          algorithm: 'SHA1',
          digits: 6,
          period: 30,
          secret: secret
        });

            if(typedToken) {
              let delta = this.authenticatedOTPAuth.validate({
                token: typedToken,
                window: 1
              })

              return this.validateUser(delta);
            } else {
              return false;
            }

      } else {
            if(typedToken) {
                let delta = this.OTPAuth.validate({
                  token: typedToken,
                  window: 1
                })

                return this.validateUser(delta);
             } else {
               return false
             }

      }
    }

    validateUser(delta: number | null) {
      if(delta !== null) {
        return true;
      }
      else {
        return false;
      }
    }

    registerAuthenticatedSecret() {
      let registeredParam = {
        id: this.authTokenId,
        secret: this.OTPAuth.secret.base32

      };
      this.http.post(`${environment.apiBaseUrl}/authGoogleAuthenticated`, registeredParam ).subscribe({
        next: res => console.log('registered'),
        error: erro => console.log('erro', erro)
      })
    }

    deleteTempSecret(id: string) {
      return this.http.delete(`${environment.apiBaseUrl}/authGoogleGenerate/${id}`);
    }

    deleteSecret(email: string) {
      console.log(this.authTokenId);
      return  this.http.delete(`${environment.apiBaseUrl}/authGoogleAuthenticated/${email}`);
    }
}
interface QrCodeModel {
  create: Function;
  toCanvas: (canvas: HTMLElement | null ,otpauth: string, callBack: Function) => void;
  toDataURL: Function;
  toString: Function;
}

interface AuthTokenUserModel {
  id: string;
  temp_secret: string;
}

interface AuthenticatedUserModel {
  id: string;
  secret: string;
}

interface ValidateTokenModel {
  typedToken: string;
  temp_secret: string;
  userId: string
}
