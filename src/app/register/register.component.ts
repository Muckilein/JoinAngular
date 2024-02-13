import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  password2: string = '';
  email: string = '';
  first_name: string = '';
  last_name: string = '';
  constructor(private router: Router){};

  async registerUser(){
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "username": this.username,
      "password": this.password,
      "password2":this.password2,
      "email":this.email,
      "first_name":this.first_name,
      "last_name":this.last_name
    });
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    try {
      let resp = await fetch(environment.baseUrl+"/registerAPI/", requestOptions);   
     
      // TODO: Redirect
      this.router.navigateByUrl('/login');
    } catch(e){
      // Show error message
      console.error(e);

    }

    }
 
}
