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
  authTokenId: string = '';

  constructor(private http: HttpClient) { }




  requestAuthToken(formData: FormGroup) {
    return this.http.post(`${environment.apiBaseUrl}/auth/token`, formData);
  }

  validateAuthToken(authToken: Object) {
    return this.http.get(`${environment.apiBaseUrl}/auth/validate-token`, authToken)
  }

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



    mockRequestValidateGoogleAuthToken( typedToken: string, secret? : string, email?: string){
      if(secret !== '' && email !== '') {
        console.log('passei o segredo e email, usuario autrnticado',secret)
        this.authTokenId = email as string;
        this.OTPAuth = new OTPAuth.TOTP({
          issuer: 'MFA FACTOR', // YOUR PROJECT_NAME //
          label: email, // USER E-MAIL //
          algorithm: 'SHA1',
          digits: 6,
          period: 30,
          secret: secret
        });
      }

      if(typedToken) {
        let delta = this.OTPAuth.validate({
          token: typedToken,
          window: 1
        })
        console.log('token:', typedToken);
        console.log('secret', secret);
        console.log('delta', delta)

        return this.validateUser(delta);

      } else {
        return false
      }

    }


    validateUser(delta: number | null) {
      if(delta !== null) {
        this.deleteTempSecret('delete');
        return true;
      }
      else {
        return false;
      }
    }

    deleteTempSecret(action: string) {
      this.http.delete(`${environment.apiBaseUrl}/authGoogleGenerate/${ this.authTokenId}`).subscribe({
        next: res => {
          console.log('deleted');
            if(action === "delete") {
              this.registerSecretAuthenticatedSecret();
            }
        },
        error: erro => console.log('idDontExist', erro)
      });
    }

    registerSecretAuthenticatedSecret() {
      let registeredParam = {
        id: this.authTokenId,
        secret: this.OTPAuth.secret.base32

      };
      this.http.post(`${environment.apiBaseUrl}/authGoogleAuthenticated`, registeredParam ).subscribe({
        next: res => console.log('registered'),
        error: erro => console.log('erro', erro)
      })
    }

    deleteSecret(email: string) {
      console.log(this.authTokenId);
      this.http.delete(`${environment.apiBaseUrl}/authGoogleAuthenticated/${email}`).subscribe({
        next: res => {
         console.log('secret deleted')
        },
        error: erro => console.log('idDontExist', erro)
      });
    }
}

interface AuthTokenGoogleParams {
  id: string;
  temp_secret?: string;
  secret?:string;
}



interface QrCodeModel {
  create: Function;
  toCanvas: (canvas: HTMLElement | null ,otpauth: string, callBack: Function) => void;
  toDataURL: Function;
  toString: Function;
}

interface AuthenticatedUserModel {
  id: string;
  secret: string;
}
