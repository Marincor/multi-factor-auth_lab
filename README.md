# AuthMFA  - <img src="https://guide.duo.com/static/images/how-it-works_2x.png" width="100px" style="background: white" />
> lab project to implements Multi-factor authentication
>  ![npm version](https://img.shields.io/badge/angular-13.1.3-angular)


## 🛈 About

Project made to registrate an understandment about implementation of an <a href="https://angular.io/"> Angular </a> mfa application. In this project, it used two concepts, oneof them is authentication token by sending directly to the user email the temporary token, and the another one is authentication with QrCode using a mobile app (preferably <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=pt_BR&gl=US"> Google Authenticator
 </a>) to read the QrCode and generate the secret token. 
 
![image](https://user-images.githubusercontent.com/84210050/155857240-b72d96c6-a3f9-4aab-a8fb-d960dc7fe25b.png)

![image](https://user-images.githubusercontent.com/84210050/155857222-29206475-4b7e-4a99-b55d-510f08b634a0.png)

![image](https://user-images.githubusercontent.com/84210050/155857260-9d6725b2-ade4-4f73-a027-baf01c5ac7ab.png)

![image](https://user-images.githubusercontent.com/84210050/155857381-077b8fa3-3d6c-4769-aaaf-d8c359a0dd44.png)



## 🏢 Architeture
 Was used <a href="https://angular.io/"> <img src="https://cdn.worldvectorlogo.com/logos/angular-icon-1.svg"  title="Angular" width="10px" /> Angular </a> to made the frontend part of this project, divide it in the follow segment: 
  ```
./src
├── src
│   └── app
│       ├── infrastructure
│       │   └── utils.ts
│       ├── services
│       │   └── auth 
│       │       └── auth.service.ts  // requests and the mock
│       │   
│       ├── shared
│       │   └──multifactorauth
│       │      │ 
│       │      └──authTokenAuthentication  // component authentication by email
│       │      │  
│       │      └──googleAuthentication    //  component authentication by QrCode
│       │      │ 
│       │      └──multifactorauth.component.html
│       │      └──multifactorauth.component.ts
└───────├── views 
        │    └── login
        │    └── dashboard
        ├── app-routing.module.ts
        ├── app-component.html
        ├── app-component.scss
        ├── app.component.ts
        └── app.module.ts
```

## 📚 Libraries

   -  <a href="https://www.primefaces.org/primeng/"> <img src="https://www.primefaces.org/primeng/resources/images/primeng-logo-horizontal.svg" title="primeNG" width="80px" /> PrimeNG </a>
   > User Interface
  
  - <a href="https://www.npmjs.com/package/qrcode"> <img src="https://img.icons8.com/cotton/2x/000000/qr-code--v2.png" title="qrCode" width="20px" />node QrCode </a>
   > QrCode Generator 
   
  -  <a href="https://www.npmjs.com/package/otpauth"> 🔑 OTPAuth </a>
   > TOTP Generator and Validator of secret token 

 -  <a href="https://www.npmjs.com/package/json-server"> ☁️ JSON-Server </a>
   > API REST FAKE

## ⚙️ Instructions and configurations
  - clone the repository to your machine: <code> git clone https://github.com/Marincor/multi-factor-auth_lab.git </code> ;
  - go to the path of the project and run the command to download the dependencies: <code>npm install</code> or <code>yarn install</code>;
  - in the root create a file called db.json and follow the db.example.json in this repository to guides you, conform you will use the application it will be filled like if beeing an api, using the fake api from json-server: 
 ```javascript
    {
  "authToken": [
    {
      "email": "AN_EMAIL",
      "password": "AN_PASSWORD",
      "generatedToken": 0,
      "id": 1
    }
  ],
  "authGoogleGenerate": [
    {
      "id": "LOGGED_EMAIL",
      "temp_secret": "TEMP_SECRET"
    }
  ],
  "authGoogleAuthenticated": [
    {
      "id": "LOGGED_EMAIL",
      "secret": "TEMP_SECRET TURNED PERMANENT_SECRET"
    }
  ]


}
```
- in the /src/environments/ create a file environment.ts and follow environment.example.ts in this repository to guides you, complete the apiBaseUrl with 'http://localhost:3000' if you will use json-server to create a local server or filled it with the real api url;
- to run the json-server and it create the server to your db.json run <code>npx json-server --watch db.json</code>, the default door of json-server is 3000;
- to run your angular project run <code>npm start</code>.
 
