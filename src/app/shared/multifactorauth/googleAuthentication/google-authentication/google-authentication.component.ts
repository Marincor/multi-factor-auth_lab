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
  @Input() QrCodeToken: string = '';
  @Output() QrCodeTokenEvent = new EventEmitter();
  OTPAuth: OTPAuth.TOTP = new OTPAuth.TOTP;
  id: string = "";
  typedToken: string = "";
  countdownConfig = {
    leftTime: this.OTPAuth.period,
    formatDate: ({ date }: {date: number}) => `${date / 1000}`,
  }
  displayInfo: boolean = false;
  authenticatedUser?: boolean ;

  constructor( private authService: AuthService) {

  }

  ngOnInit(): void {
    this.checkAuthenticatedUser();
  }

  checkAuthenticatedUser() {
    this.authService.mockCheckAuthenticatedUser(this.userForm.get('email').value).subscribe({
      next: (res) => {
        console.log('res', res)
        this.authenticatedUser = true;
        this.validateAuthToken(res.secret, res.id)
      },
      error: (erro) => {
        console.log('error', erro);
        this.generateQrCode();

      }
    });
  }

   generateQrCode()  {
      this.authenticatedUser = false;
      this.authService.mockRequestGoogleAuthToken(this.userForm.get('email').value);

  }

  onOtpChange(event:string) {
    console.log('onotpchangeogogle', event);
    if(event.length === 6) {
      console.log('if onotpchange')
      this.QrCodeTokenEvent.emit(event);
      this.typedToken = event;
    } else {
      this.QrCodeTokenEvent.emit('');
      this.typedToken = '';
    }
  }

  onCountDown(event: any) {
    if(event.action === "done") {
      this.generateQrCode();
      document.getElementById('restartCountdown')?.click();

    }
  }


  validateAuthToken(secret?:string, email?:string) {
          if(this.typedToken) {
              let valid = this.authService.mockRequestValidateGoogleAuthToken(this.typedToken, secret, email);
            if(valid) {
              alert('authtoken validate');
              window.location.href = '/dashboard'
            } else {
              alert('token inválido')
            }
          }
  }

  resetQrCodeKey() {
      this.authService.deleteSecret(this.userForm.get('email').value);
      this.checkAuthenticatedUser();
  }

}

