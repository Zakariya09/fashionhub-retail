import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultlayoutComponent } from './defaultlayout.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ManageReceiptComponent } from '../pages/manage-receipt/manage-receipt.component';
import { AddReceiptComponent } from '../pages/add-receipt/add-receipt.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { ManageProductComponent } from '../pages/manage-product/manage-product.component';
import { ManageUserComponent } from '../pages/manage-user/manage-user.component';
import { ManageImportComponent } from '../pages/manage-import/manage-import.component';
import { ManageSalesComponent } from '../pages/manage-sales/manage-sales.component';
import { ManageCreditsComponent } from '../pages/manage-credits/manage-credits.component';
import { ChangePasswordComponent } from '../pages/change-password/change-password.component';
import { HeaderComponent } from '../common/header/header.component';
import { SidebarComponent } from '../common/sidebar/sidebar.component';
import { FooterComponent } from '../common/footer/footer.component';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { SharedModule } from '../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';

const routes: Routes = [
  // { path: '', redirectTo: '/layout', pathMatch: 'full', data: { title: 'Layout' } },
  {
      path: '', component: DefaultlayoutComponent,
      children:
          [
              { path: '', redirectTo: 'default/dashboard', pathMatch: 'full' },
              { path: 'default/dashboard', component:DashboardComponent },
                {
                  path:'default/dashboard',
                  component:DashboardComponent,
                  data:{
                    title:'Dashboard'
                  }
                },
                {
                  path:'default/receipt',
                  component: ManageReceiptComponent,
                  data:{
                    title:'Manage Receipt'
                  }
                },
                {
                  path:'default/product',
                  component:ManageProductComponent,
                  data:{
                    title:'Manage Product'
                  }
                },
                {
                  path:'default/user',
                  component:ManageUserComponent,
                  data:{
                    title:'Manage User'
                  }
                },
                {
                  path:'default/import',
                  component:ManageImportComponent,
                  data:{
                    title:'Manage Import'
                  }
                },
                {
                  path:'default/sales',
                  component:ManageSalesComponent,
                  data:{
                    title:'Manage Sales'
                  }
                },
                {
                  path:'default/credits',
                  component:ManageCreditsComponent,
                  data:{
                    title:'Manage Credits'
                  }
                },
                {
                  path:'default/addReceipt',
                  component:AddReceiptComponent,
                  data:{
                    title:'Add Receipt'
                  }
                },
                {
                  path:'default/change-password',
                  component: ChangePasswordComponent,
                  data:{
                    title:'Change Password'
                  }
                }
          ]
  },
]

@NgModule({
  declarations: [
    HeaderComponent,
    DashboardComponent,
    SidebarComponent,
    FooterComponent,
    DefaultlayoutComponent,
    ChangePasswordComponent,
    ManageProductComponent,
    ManageImportComponent,
    ManageSalesComponent,
    ManageCreditsComponent,
    ManageUserComponent,
    ManageReceiptComponent,
    AddReceiptComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    NgxPaginationModule,
  ],
  exports: [RouterModule],
  bootstrap: [DefaultlayoutComponent],
  providers: [  { provide: AuthGuard, useClass: AuthService }]
})
export class DefaultlayoutModule { }
