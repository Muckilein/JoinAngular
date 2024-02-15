import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';


@Component({
  selector: 'app-all-todos',
  templateUrl: './all-todos.component.html',
  styleUrl: './all-todos.component.scss'
})
export class AllTodosComponent implements OnInit {
  todos: any = [];
  error = '';
  constructor(private http: HttpClient, private router: Router) { }


  async ngOnInit() {
    try {
      this.todos = await this.loadTodos();
      console.log(this.todos);
    } catch (e) {
      this.error = 'Fehler beim Laden!';
    }
  }

  loadTodos() {
    let headers = new HttpHeaders();
    headers = headers.set(
      'Authorization', 'Token ' + localStorage.getItem('token')
    );
    const url = environment.baseUrl + '/todos/';
    //return this.http.post(url, httpOptions);

    return lastValueFrom(this.http.get(url, { headers: headers }));
  }

  async logout() {
    try {
      localStorage.removeItem('token');
      let resp = await fetch(environment.baseUrl + "/logout/");
      console.log(resp);
      // TODO: Redirect
      this.router.navigateByUrl('/login');
    } catch (e) {
      // Show error message
      this.router.navigateByUrl('/login');

    }
  }

}