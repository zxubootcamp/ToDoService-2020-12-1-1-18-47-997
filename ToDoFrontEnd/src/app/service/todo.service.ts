import { Injectable } from '@angular/core';
import { ToDoItem } from '../model/ToDoItem';
import { TodoHttpService } from './todo-http.service';
import { TodoStoreService } from './todo-store.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  public updatingToDoItem: ToDoItem;
  public selectedTodoItem: ToDoItem;
  private currentId: number = 0;
  public getAllFailMessage: string;

  private _todoItems: Array<ToDoItem>;

  constructor(private todoStore: TodoStoreService, private todoHttpService: TodoHttpService) {
    this._todoItems = todoStore.GetAll();
    this.updatingToDoItem = new ToDoItem(-1, "", "", false);
    this.selectedTodoItem = new ToDoItem(-1, "", "", false);
    // this.currentId = this.todoItems.length;
    this.getAllFailMessage = '';
  }

  public get todoItems(): Array<ToDoItem> {
    const allToDoItem = new Array<ToDoItem>();
    this.todoHttpService.GetAll().subscribe(
      todoItems => {
        allToDoItem.push(...todoItems);
      },
      error => {
        this.getAllFailMessage = 'Get all fails bucause webapi error';
      }
    );
    return allToDoItem;
  }// get 可以暴露双向绑定

  public SetUpdatingTodoItemId(id: number): void {
    const foundTodoItem = this.todoStore.FindById(id);

    if (foundTodoItem !== undefined) {
      this.updatingToDoItem = Object.assign({}, foundTodoItem);
    }
  }

  public Create(todoItem: ToDoItem) {
    todoItem.id = this.currentId;
    var newTodoItem = Object.assign({}, todoItem);
    this.todoStore.Create(newTodoItem);
    this.currentId++;
  }

  public UpdateTodoItem(updateTodoItems: ToDoItem): void {
    this.todoStore.Update(updateTodoItems);
  }

  public DeleteTodoItem(id: number): void {
    this.todoStore.Delete(id);
  }

  public SetSelectedTodoItemId(id: number): void {
    this.selectedTodoItem = this.todoStore.FindById(id);
  }
}
