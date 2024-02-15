import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AllTodosComponent } from './all-todos/all-todos.component';
import { RegisterComponent } from './register/register.component';
import { CreateTodoComponent } from './create-todo/create-todo.component';

const routes: Routes = [ {path: '', redirectTo: 'login', pathMatch: 'full'},
{path: 'login', component: LoginComponent},
{path: 'todos', component: AllTodosComponent},
{path: 'register', component: RegisterComponent},
{path: 'createTodo', component: CreateTodoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
