import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerComponent } from './customer/customer.component';
import { AccountComponent } from './account/account.component';
import { FundTransferComponent } from './fund-transfer/fund-transfer.component';


const routes: Routes = [
  {path: '', component : CustomerComponent},
  {path: 'account', component : AccountComponent},
  {path: 'fund-transfer', component : FundTransferComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
