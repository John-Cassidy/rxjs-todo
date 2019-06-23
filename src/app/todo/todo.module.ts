import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { TodoHttpService } from './http/todo-http.service';
import { TodoStoreService } from './store/todo-store.service';

import { TodoListComponent } from './components/todo-list.component';
import { TodoListItemComponent } from './components/todo-list-item.component';
import { TodoAddItemComponent } from './components/todo-add-item.component';
import { TodoEditComponent } from './components/todo-edit.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule
  ],
  declarations: [
    TodoListComponent,
    TodoListItemComponent,
    TodoAddItemComponent,
    TodoEditComponent
  ],
  providers: [
    TodoHttpService,
    TodoStoreService
  ]
})
export class TodoModule { }
