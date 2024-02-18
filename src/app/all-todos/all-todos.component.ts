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
  contacts:any=[];
  detailedTask :any ={};
  taskIndex =0;
  showDetail = false;
  subtask = "";
  error = '';
  openContactList:boolean = false;
  constructor(private http: HttpClient, private router: Router) { }


  async ngOnInit() {
    try {
      this.todos = await this.loadTodos();
      this.contacts = await this.loadContacts();
      console.log(this.todos);
      console.log(this.contacts);
    } catch (e) {
      this.error = 'Fehler beim Laden!';
    }
  } 


  loadTodos() {
    let headers = new HttpHeaders();
    headers = headers.set(
      'Authorization', 'Token ' + localStorage.getItem('token')
    );
    const url = environment.baseUrl + '/createTodoAPI/';
    //return this.http.post(url, httpOptions);

    return lastValueFrom(this.http.get(url, { headers: headers }));
  }
  loadContacts() {
    let headers = new HttpHeaders();
    headers = headers.set(
      'Authorization', 'Token ' + localStorage.getItem('token')
    );
    const url = environment.baseUrl + '/contacts/';
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

  openDetails(task:any, index :number){
    this.detailedTask =task ;
    this.taskIndex = index;
    this.showDetail = true;
  }
  back(){
    this.showDetail = false;
  }

  async save(){
    this.todos[this.taskIndex] = this.detailedTask;
    console.log(this.todos);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "id":this.detailedTask.id,
      "title": this.detailedTask.title,
      "description": this.detailedTask.description,
      "date": this.detailedTask.date,
      "category": this.detailedTask.category,
      "color": this.detailedTask.color,
      "checked": this.detailedTask.checked,
      "prio": this.detailedTask.prio,
      "state": this.detailedTask.state,
      "subtask":this.detailedTask.subtask,
      "assignments" : this.detailedTask.assignments
    });

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    try {
      let resp = await fetch(environment.baseUrl+"/editTodoAPI/", requestOptions);
      let json = await resp.json();
      
      // TODO: Redirect
      this.router.navigateByUrl('/todos');
    } catch(e){
      // Show error message
      console.error(e);

    }
  }

  addSubtask(){ 
  console.log(this.subtask);
  let sub = {'id': 'null', 'title':this.subtask ,'checked':false};
  this.detailedTask.subtask.push(sub);  
  this.subtask = "";
  console.log(this.detailedTask);
  }
  addAssigments(){
    this.openContactList = true;    
  }
  addC(c:any){
    this.openContactList = false;
    let ass = {'id': c['id'], 'name':c['name']};
    let exist = false;
    let actualAssigments = this.detailedTask.assignments;
    actualAssigments.forEach((a:any)=>{
     if(a['id'] == c['id'])
     { 
      exist = true;
     }
    })
    if(!exist)
    {this.detailedTask.assignments.push(ass);}
  }

}