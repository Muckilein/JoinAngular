import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-todo',
  templateUrl: './create-todo.component.html',
  styleUrl: './create-todo.component.scss'
})
export class CreateTodoComponent {
  title: string = '';
  description: string = '';
  date: Date = new Date("2024-05-12");
  category: string = '';
  color: string = '';
  checked: boolean = false;
  prio: string = '';
  state: string = '';

  constructor(private router: Router){};

  async createTodo() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "title": this.title,
      "description": this.description,
      "date": this.date,
      "category": this.category,
      "color": this.color,
      "checked": this.checked,
      "prio": this.prio,
      "state": this.state,
    });

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    try {
      let resp = await fetch(environment.baseUrl+"/createTodoAPI/", requestOptions);
      let json = await resp.json();
      
      // TODO: Redirect
      this.router.navigateByUrl('/todos');
    } catch(e){
      // Show error message
      console.error(e);

    }
  }

  async getTodos(){
   let resp = await fetch('http://127.0.0.1:8000/createTodoAPI/');
   let js = await resp.json() ;
   console.log(JSON.parse(js));
  }
}
