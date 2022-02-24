import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import base32Encode from 'base32-encode';
import { totp } from 'otplib';

@Component({
  selector: 'app-google-authentication',
  templateUrl: './google-authentication.component.html',
  styleUrls: ['./google-authentication.component.scss']
})
export class GoogleAuthenticationComponent implements OnInit {
  @Input() userForm?: FormGroup |  any;
  twoFactor: any ;
  secret: string = ''
  qrcode: any;
  token : any;
  data = new Uint8Array([0x74, 0x65, 0x73, 0x74])

  constructor() {
    this.twoFactor = require('totp-generator');
    this.qrcode = require('qrcode');
  }

  ngOnInit(): void {

    console.log("google auth", this.userForm)
    const otplib = require('otplib');
    if(this.userForm) {
      this.secret = makeBase32(32)
      this.token = this.twoFactor(this.secret);
      let newTokenTest = totp.generate(this.secret);
      console.log(newTokenTest)
      let token = this.token;

      console.log('secret', this.secret)
      // let otpauth = `otpauth://totp/otp:Marincor?secret=${token32}issuer=otp`;

      console.log('token deveser', token)


      const otpauth = totp.keyuri(`${this.userForm.get('email').value}`, "project_name", this.secret);
    this.qrcode.toCanvas(document.getElementById('canvas'), otpauth, function(error: any) {

      if (error) {
        console.error(error);
      }

    });


    }


    try {

      setTimeout(() =>{
        let typedtoken = prompt('token') as string;
        console.log('typed', typedtoken)
        let isValid = totp.check(
         this.secret,
         typedtoken
        )
        console.log(isValid)
      }, 2000)


    } catch(error) {
      console.log('error to valid', error)
    }



  }


}

function makeBase32(length: any) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() *
charactersLength));
 }
 return result.toUpperCase();
}
