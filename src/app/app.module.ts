import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SummaryComponent } from './summary/summary.component';
import { ManageComponent } from './manage/manage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
const routes: Routes = [
  {
    path: '',
    redirectTo: '/summary',
    pathMatch: 'full',
  },

  {
    path: 'summary',
    component: SummaryComponent,
  },
  {
    path: 'manage',
    component: ManageComponent,
  },
];
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SummaryComponent,
    ManageComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
