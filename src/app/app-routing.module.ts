import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent }   from './dashboard/dashboard.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { ShowInfoComponent } from './show-info/show-info.component';
import { BackendComponent } from './backend/backend.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'lists/:id', component: TodoListComponent },

  { path: 'admin', component: BackendComponent },
  { path: 'admin/users', component: BackendComponent },
  { path: 'admin/lists', component: BackendComponent },
  { path: 'admin/entries', component: BackendComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}