import { AuthService } from 'src/app/services/auth/auth.service';
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
  secret: any = {
    ascii:'',
    base32: '',
    hex: '',
    otpauth_url: ''
  };
  qrcode: any;
  token : any;
  data = new Uint8Array([0x74, 0x65, 0x73, 0x74]);
  id: string = ""

  constructor( private authService: AuthService) {
    // this.twoFactor = require('totp-generator');
    this.qrcode = require('qrcode');
  }

  ngOnInit(): void {

    console.log("google auth", this.userForm);
    if(this.userForm) {
      const { v4: uuidv4 } = require('uuid');
      let code32 = makeBase32(32);
      this.id = uuidv4();
      this.secret ={
        base32: code32 ,
        otpauth_url: totp.keyuri(`${this.userForm.get('email').value}`, "project_name", "KFCTML3YPBRTS3DMKRIWSUDRNREUUNJU")
      }
      let params = {
        id: this.id,
        secret: this.secret.base32
      }
      this.authService.mockRequestGoogleAuthToken(params).subscribe(
        {
          next: data => {
            console.log('data mock', data)
          },
          error: error => console.log(error)
        }
      )

      let token = this.token;

      console.log('secret', this.secret)
      console.log('token deveser', token)
      // let otpauth = `otpauth://totp/otp:Marincor?secret=${token32}issuer=otp`;



    this.qrcode.toCanvas(document.getElementById('canvas'), this.secret.otpauth_url, function(error: any) {

      if (error) {
        console.error(error);
      }

    });


    }


    try {

      setTimeout(() =>{
        let typedtoken = prompt('token') as string;
          if(typedtoken) {

              let params = {
                secret: 'KFCTML3YPBRTS3DMKRIWSUDRNREUUNJU',
                token: typedtoken
              }
              let valid = this.authService.mockRequestValidateGoogleAuthToken(params);

              console.log(valid)
          }

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


