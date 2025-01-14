import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PolicyFormComponent } from './components/policy-form/policy-form.component';
import { PolicyComponent } from './components/policy/policy.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'add-policy', component: PolicyFormComponent },
  { path: 'policy/:id', component: PolicyComponent }
];

// Allows navigation with anchor tag to specific page sections.
const routerOptions: ExtraOptions = {
  useHash: false,
  anchorScrolling: 'enabled',
  onSameUrlNavigation: 'reload' //Must have if you want to be able to use the anchor more than once
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
