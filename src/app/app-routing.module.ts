import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { ManageReceiptComponent } from './pages/manage-receipt/manage-receipt.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, data: { title: 'Login' } },
    { path: '',canActivate: [AuthGuard], loadChildren: ()=> import("./defaultlayout/defaultlayout.module").then(m => m.DefaultlayoutModule)},
    { path: '**', component: ManageReceiptComponent},

  ];
@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
