import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-multifactorauth',
  templateUrl: './multifactorauth.component.html',
  styleUrls: ['./multifactorauth.component.scss']
})
export class MultifactorauthComponent implements OnInit {

  @Input() loginForm?: FormGroup;
  authForm?: FormGroup;
  display = true;
  displayInfo = false;
  displayResendToken = false;
  authType = {
    ngOtp: false,
    googleAuth: false
  }
  ngOtp: string = '';




  constructor(private authService: AuthService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    // google temp secret //
    this.authService.deleteTempSecret(this.loginForm?.get('email')?.value).subscribe(
      {
        next: res => console.log(res),
        error: erro => console.error(erro)
      }
    );

  }


  onOtpChange(event: string) {
    if(event.length === 6) {
      this.ngOtp = event;
      this.authForm = this.fb.group({
        ngOtp: ''
      })
      this.authForm.get('ngOtp')?.setValue(this.ngOtp)
    }
     else {
      this.ngOtp = '';
    }
  }

  onSelectAuthType(type: AuthType) {
      this.authType[type] = true;
      if(type === 'ngOtp') {
        this.requestAuthToken();
      }
  }

  onCancelSelectAuthType() {
    this.authType.ngOtp = false
    this.authType.googleAuth = false;
    this.ngOtp = '';
    this.displayInfo = false;
    // delete google temp secret //
    this.authService.deleteTempSecret(this.loginForm?.get('email')?.value).subscribe(
      {
        next: res => console.log(res),
        error: erro => console.error(erro)
      }
    );
  }

  // validate the typed token //


  // request that backend send an authtoken to the user email //
  requestAuthToken() {
    this.authService.mockRequestAuthToken(this.loginForm?.value).subscribe({
      next: data => {
        console.log(data);
        this.displayInfo = true;
        this.displayResendToken = false;
        alert('Token de autenticação enviado para o seu email');
      },
      error: error => {
        console.log(error);
        this.displayInfo = true;
        this.displayResendToken = false;
        alert('Erro ao solicitar o token');
      }
    });
  }


  onCountDown(event: any) {
    console.log('multifactor', event)
    if(event.action === "done") {
      this.displayInfo = false;
      this.displayResendToken = true;
    }
  }



}
type AuthType = "ngOtp" | "googleAuth";

