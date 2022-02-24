import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


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
  countdownConfig = {
    leftTime: 6,
    formatDate: ({ date }: {date: number}) => `${date / 1000}`,
  }



  constructor() { }

  ngOnInit(): void {
  }

  onOtpChange(event:string) {

    if(event.length === 6) {
      this.otpEvent.emit(event);
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

}
