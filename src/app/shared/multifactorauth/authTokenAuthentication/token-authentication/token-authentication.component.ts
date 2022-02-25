import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-token-authentication',
  templateUrl: './token-authentication.component.html',
  styleUrls: ['./token-authentication.component.scss']
})
export class TokenAuthenticationComponent implements OnInit {


  @Output() otpEvent = new EventEmitter();
  @Output() countdownEvent = new EventEmitter();
  @Output() requestAuthTokenEvent = new EventEmitter();
  @Input() displayInfo?: boolean;
  @Input() displayResendToken?: boolean;
  @Input() authType = {
    ngOtp: false,
  }
  @Input() ngOtp?: string;

  countdownConfig = {
    leftTime: 6,
    formatDate: ({ date }: {date: number}) => `${date / 1000}`,
  }



  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onOtpChange(event:string) {
    console.log()
    if(event.length === 6) {
      this.otpEvent.emit(event);
    }
    else {
      this.otpEvent.emit('');
    }
  }

  onCountDown(event: any) {
    console.log(event)
    if(event.action === "done") {
      this.countdownEvent.emit(event);
    }
  }

  requestAuthToken() {
    this.requestAuthTokenEvent.emit(true);
  }


  validateAuthToken() {
      if(this.ngOtp !== '') {
        console.log(this.ngOtp);

        let ngOtp = {
          ngOtp: this.ngOtp,
          email: 'teste@teste.com.br',
          password: '12455'
        }
        var queryString = Object.keys(ngOtp).map((key) => key + '=' + ngOtp[`${key as Params}`]).join('&');
        this.authService.mockValidateAuthToken(queryString).subscribe({
          next: data => {
            console.log(data)
            alert('tokenvalidate');
            window.location.href = '/dashboard'

          },
          error: error => console.log(error)
        })

      }

  }

}


type Params =   "ngOtp" | "email" | "password";
