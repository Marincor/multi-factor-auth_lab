import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  multifactorAuth: boolean = false;
  loginForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required]
    });

  }


  login() {
    console.log('validação feita, login');
    if(this.loginForm.valid) {
      this.multifactorAuth = true;
    }
  }
}
