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
  countdownConfig = {
    leftTime: 6,
    formatDate: ({ date }: {date: number}) => `${date / 1000}`,
  }
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
    this.authType.ngOtp = false;
    this.authType.googleAuth = false;
    this.ngOtp = '';
    this.displayInfo = false;
  }

  // validate the typed token //
  validateAuthToken() {
    if(this.ngOtp !== '') {
      console.log(this.ngOtp);
      this.authService.validateAuthToken(this.ngOtp).subscribe({
        next: data => console.log(data),
        error: error => console.log(error)
      })

    }
  }

  // request that backend send an authtoken to the user email //
  requestAuthToken() {
    this.authService.requestAuthToken(this.loginForm?.value).subscribe({
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
    console.log(event)
    if(event.action === "done") {
      this.displayInfo = false;
      this.displayResendToken = true;
    }
  }

}
type AuthType = "ngOtp" | "googleAuth";
