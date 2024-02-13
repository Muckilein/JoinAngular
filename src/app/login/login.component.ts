import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  constructor(private router: Router){};

  async login() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "username": this.username,
      "password": this.password
    });

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    try {
      let resp = await fetch(environment.baseUrl+"/login/", requestOptions);
      let json = await resp.json();
      localStorage.setItem('token', json.token);
      // TODO: Redirect
      this.router.navigateByUrl('/todos');
    } catch(e){
      // Show error message
      console.error(e);

    }
  }
}
