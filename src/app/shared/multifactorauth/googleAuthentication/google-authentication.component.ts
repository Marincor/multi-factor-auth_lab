import { AuthService } from 'src/app/services/auth/auth.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as OTPAuth from 'otpauth';



@Component({
  selector: 'app-google-authentication',
  templateUrl: './google-authentication.component.html',
  styleUrls: ['./google-authentication.component.scss']
})
export class GoogleAuthenticationComponent implements OnInit {
  @Input() userForm?: FormGroup |  any;
  OTPAuth: OTPAuth.TOTP = new OTPAuth.TOTP;
  id: string = "";
  typedToken: string = "";
  countdownConfig = {
    leftTime: this.OTPAuth.period,
    formatDate: ({ date }: {date: number}) => `${date / 1000}`,
  }
  displayInfo: boolean = false;
  authenticatedUser?: boolean ;
  authenticatedSecret: string = '';

  constructor( private authService: AuthService) {

  }

  ngOnInit(): void {
    this.checkAuthenticatedUser();
  }

  checkAuthenticatedUser() {
    this.authService.mockCheckAuthenticatedUser(this.userForm.get('email').value).subscribe({
      next: (res) => {
        console.log('authenticated', res)
        this.authenticatedUser = true;
        this.authenticatedSecret = res.secret;
        this.validateAuthToken( res.id)
      },
      error: (erro) => {
        console.log('notauthenticated', erro);
        this.generateQrCode();

      }
    });
  }

  generateQrCode()  {
      this.authenticatedUser = false;
      let email = this.userForm.get('email').value;
      this.authService.deleteTempSecret(email).subscribe(
        {
          next: res => {
            this.authService.mockRequestGoogleAuthToken(email);
          },
          error: erro => this.authService.mockRequestGoogleAuthToken(email)
        }
      )
  }

  onOtpChange(event:string) {
    if(event.length === 6) {
      this.typedToken = event;
    } else {
      this.typedToken = '';
    }
  }

  onCountDown(event: any) {
    if(event.action === "done") {
      this.generateQrCode();
      document.getElementById('restartCountdown')?.click();
    }
  }


  validateAuthToken( email?:string) {
    if(this.typedToken) {
      let valid = this.authService.mockRequestValidateGoogleAuthToken(
        this.typedToken,
        this.authenticatedSecret, email);
      if(valid) {
        alert('authtoken validate');
        this.authService.deleteTempSecret(this.userForm.get('email').value).subscribe({
          next: res => {
            console.log('deleted');
            this.authService.registerAuthenticatedSecret();
            window.location.href = '/dashboard';


          },
          error: erro => {
            console.log('id not find', erro);
            window.location.href = '/dashboard';
          }

        });
      }else {
        alert('token inválido')
      }
    }
  }

  resetQrCodeKey() {
      this.authService.deleteSecret(this.userForm.get('email').value).subscribe({
        next: res => {
         console.log('secret deleted');
         this.authenticatedSecret = '';
         this.checkAuthenticatedUser();
        },
        error: erro => console.log('idDontExist', erro)
      });
  }

}

