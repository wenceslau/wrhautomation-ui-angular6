import { VacationComponent } from './movement/vacation/vacation.component';
import { AliquotComponent } from './maintenance/aliquot/aliquot.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyComponent } from './maintenance/company/company.component';
import { DatasourceComponent } from './maintenance/datasource/datasource.component';
import { EmployeeComponent } from './maintenance/employee/employee.component';
import { MetadataComponent } from './maintenance/metadata/metadata.component';
import { QueryComponent } from './maintenance/query/query.component';
import { LoginComponent } from './security/login/login.component';
import { ProfileComponent } from './maintenance/profile/profile.component';
import { AccountComponent } from './maintenance/account/account.component';
import { AdvanceComponent } from './movement/advance/advance.component';
import { RescissionComponent } from './movement/rescission/rescission.component';

import { AuthorizerGuard } from './security/authorizer.guard';
import { HomeComponent } from './core/home/home.component';
import { PayrollComponent } from './movement/payroll/payroll.component';
import { PaymentComponent } from './movement/payment/payment.component';
import { Plpt2Component } from './movement/plpt2/plpt2.component';
import { PayrollReportComponent } from './report/payroll-report/payroll-report.component';
import { PayrollDreReportComponent } from './report/payroll-dre-report/payroll-dre-report.component';
import { PaymentReportComponent } from './report/payment-report/payment-report.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: '**', redirectTo: 'pagina-nao-encontrada' },
  // { path: 'pagina-nao-encontrada', component: PaginaNaoEncontradaComponent },
  // { path: 'nao-autorizado', component: NaoAutorizadoComponent },
  {
    path: 'login',
    component: LoginComponent,
    data: { roles: ['ROLE_HOME'] } // Pode-se usar esses dados no interceptador AuthorizerGuard
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_HOME'] } // Pode-se usar esses dados no interceptador AuthorizerGuard
  },
  {
    path: 'company',
    component: CompanyComponent,
    canActivate: [AuthorizerGuard], // toda chamada dessa url faz ela passar pelo AuthorizerGuard 
    data: { roles: ['ROLE_COMPANY'] }
  },
  {
    path: 'datasource',
    component: DatasourceComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_DATASOURCE'] }
  },
  {
    path: 'employee',
    component: EmployeeComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_EMPLOYEE'] }
  },
  {
    path: 'metadata',
    component: MetadataComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_METADATA'] }
  },
  {
    path: 'query',
    component: QueryComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_QUERY'] }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_PROFILE'] }
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_ACCOUNT'] }
  },
  {
    path: 'aliquot',
    component: AliquotComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_ALIQUOT'] }
  },
  {
    path: 'advance',
    component: AdvanceComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_ADVANCE'] }
  },
  {
    path: 'rescission',
    component: RescissionComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_RESCISION'] }
  },
  {
    path: 'vacation',
    component: VacationComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_VACATION'] }
  },
  {
    path: 'payroll',
    component: PayrollComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_PAYROLL'] }
  },
  {
    path: 'payment',
    component: PaymentComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_PAYMENT_BILL'] }
  },
  {
    path: 'plpt2',
    component: Plpt2Component,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_PLPT2'] }
  },
  {
    path: 'payroll-report',
    component: PayrollReportComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_PAYROLL'] }
  },
  {
    path: 'payroll-dre-report',
    component: PayrollDreReportComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_PAYROLL'] }
  },
  {
    path: 'payment-report',
    component: PaymentReportComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_PAYMENT_BILL'] }
  },
];

@NgModule({
  imports: [
    CommonModule,

    RouterModule.forRoot(routes), // Aplica as rotas desse modulo para ser usada do modulo root, no caso o app.module
  ],
  exports: [
    // Exporta o RouterModule para usar o componente router-outlet no app.html o app.module importa esse modulo
    RouterModule
  ],
  declarations: []
})
export class AppRouterModule { }
