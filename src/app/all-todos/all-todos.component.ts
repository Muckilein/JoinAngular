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
  contacts: any = [];
  detailedTask: any = {};
  taskIndex = 0;
  showDetail = false;
  newTodo=false;
  editCategory=false;
  subtask = "";
  error = '';
  colors=['#d8ebf8','#9deb58','#cf3886','#b131e1','#7537d1','#3e76dd','#38dbd5']
  openContactList: boolean = false;
  category:any =[];
  constructor(private http: HttpClient, private router: Router) { }


  async ngOnInit() {
    try {
      this.todos = await this.loadTodos();
      this.contacts = await this.loadContacts();
      this.category = await this.loadCategory();
      console.log(this.todos);
      console.log(this.contacts);
      console.log(this.category);
    } catch (e) {
      this.error = 'Fehler beim Laden!';
    }
  }

  async loadCategory(){
    let headers = new HttpHeaders();
    headers = headers.set(
      'Authorization', 'Token ' + localStorage.getItem('token')
    );
   
     let url = environment.baseUrl + "/categoryAPI/";
     return lastValueFrom(this.http.get(url, { headers: headers }));    
    
     }

  async loadTodos() {
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

  openDetails(task: any, index: number) {
    this.detailedTask = task;
    this.taskIndex = index;
    this.showDetail = true;
    
  }

  async deleteTodo(){
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization",'Token ' + localStorage.getItem('token'))   
    const requestOptions: RequestInit = {
      method: 'DELETE',
      headers: myHeaders,      
      redirect: 'follow'
    };
    try {
      await fetch(environment.baseUrl + "/createTodoAPI/"+this.detailedTask.id+"/", requestOptions);
      this.deleteTodoFromList(this.detailedTask.id);
      this.back();    
       
      // TODO: Redirect
     // this.router.navigateByUrl('/todos');
    } catch (e) {
      // Show error message
      console.error(e);

    }
  }

  deleteTodoFromList(id:number){
    let list:any=[];
    this.todos.forEach((t:any)=>{
      if (t.id != id)
      {
        list.push(t);
      }
    })
   
    this.todos = list;
    console.log(this.todos);    
  }

  back() {
    this.showDetail = false;
    this.newTodo = false;
  }

  setTask() {
    const raw = JSON.stringify({
      "id": this.detailedTask.id,
      "title": this.detailedTask.title,
      "description": this.detailedTask.description,
      "date": this.detailedTask.date,
      "category": this.detailedTask.category,
      "color": this.detailedTask.color,
      "checked": this.detailedTask.checked,
      "prio": this.detailedTask.prio,
      "state": this.detailedTask.state,
      "subtask": this.detailedTask.subtask,
      "assignments": this.detailedTask.assignments
    });
    return raw;
  }

  makeEmptyTodo() {
    this.newTodo = true;  
    this.showDetail=true; 
    this.detailedTask.id = 0;
    this.detailedTask.title = "";
    this.detailedTask.description = "";
    this.detailedTask.date = "";
    this.detailedTask.category = {"id":0,"category":""};
    this.detailedTask.color = this.colors[Math.floor(Math.random()*7)];
    this.detailedTask.checked = "";
    this.detailedTask.prio = "";
    this.detailedTask.state = "";
    this.detailedTask.subtask = [];
    this.detailedTask.assignments = [];
  }

  async makeTodo() {
   
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization",'Token ' + localStorage.getItem('token'))
    console.log("deatiled task category ", this.detailedTask.category);
    const raw = this.setTask();
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    try {
      let resp = await fetch(environment.baseUrl + "/createTodoAPI/", requestOptions);
      let json = await resp.json();
      this.detailedTask = json;     
      this.todos.push(json);
      this.back();
      // TODO: Redirect
     // this.router.navigateByUrl('/todos');
    } catch (e) {
      // Show error message
      console.error(e);

    }
  }

  refreshStateSubtasks(){
  this.detailedTask

  }

  register(){
    this.router.navigateByUrl('/register');
  }

  async save() {
    this.todos[this.taskIndex] = this.detailedTask;   
    console.log("task",this.detailedTask);   
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization",'Token ' + localStorage.getItem('token'))
    const raw = this.setTask();
    const requestOptions: RequestInit = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    try {
      let resp = await fetch(environment.baseUrl + "/createTodoAPI/" + this.detailedTask.id + "/", requestOptions);
      let json = await resp.json();
      this.todos[this.taskIndex] = json;
      this.detailedTask = json;
      console.log(this.detailedTask);

      // TODO: Redirect
      //this.router.navigateByUrl('/todos');
    } catch (e) {
      // Show error message
      console.error(e);

    }
  }

  addSubtask() {
    console.log(this.subtask);
    if (this.subtask != "") {
      console.log(this.subtask)
      let sub = { 'id': 'null', 'title': this.subtask, 'checked': false };
      this.detailedTask.subtask.push(sub);
      this.subtask = "";
      console.log(this.detailedTask);
    }
  }
  addAssigments() {
    this.openContactList = !this.openContactList;
  }
  addC(c: any) {
    this.openContactList = false;
    let ass = { 'id': c['id'], 'name': c['name'] };
    let exist = false;
    let actualAssigments = this.detailedTask.assignments;
    actualAssigments.forEach((a: any) => {
      if (a['id'] == c['id']) {
        exist = true;
      }
    })
    if (!exist) { this.detailedTask.assignments.push(ass); }
  }

  chooseCategory(index :number){
    this.detailedTask.category =  this.category[index];
    console.log(this.detailedTask);
  }

  openEditCategory(){
    this.editCategory=!this.editCategory
  }

}