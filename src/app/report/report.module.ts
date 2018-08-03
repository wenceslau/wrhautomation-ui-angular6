import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { DropdownModule } from 'primeng/dropdown';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';


import { PayrollReportComponent } from './payroll-report/payroll-report.component';
import { ReportComponent } from './report.component';
import { PayrollDreReportComponent } from './payroll-dre-report/payroll-dre-report.component';
import { PaymentReportComponent } from './payment-report/payment-report.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    DropdownModule,
    ToolbarModule,
    ButtonModule,
    InputTextModule,
    PanelModule
  ],

  declarations: [PayrollReportComponent, ReportComponent, PayrollDreReportComponent, PaymentReportComponent],
  exports: [PayrollReportComponent, ReportComponent, PayrollDreReportComponent, PaymentReportComponent],

})
export class ReportModule { }

