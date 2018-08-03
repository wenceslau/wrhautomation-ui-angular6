import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CurrencyMaskModule } from 'ng2-currency-mask';

import { InputMaskModule } from 'primeng/inputmask';
import { CalendarModule } from 'primeng/calendar';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { AccordionModule } from 'primeng/accordion';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { KeyFilterModule } from 'primeng/keyfilter';

import { AdvanceComponent } from './advance/advance.component';
import { RescissionComponent } from './rescission/rescission.component';
import { VacationComponent } from './vacation/vacation.component';
import { PayrollComponent } from './payroll/payroll.component';
import { PayrollDetailComponent } from './payroll/payroll-detail/payroll-detail.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentSalaryComponent } from './payment/payment-salary/payment-salary.component';
import { Plpt2Component } from './plpt2/plpt2.component';
import { AdvanceInputComponent } from './advance-input/advance-input.component';
import { MaintenanceModule } from '../maintenance/maintenance.module';
import { VacationInputComponent } from './vacation-input/vacation-input.component';
import { PanelModule } from 'primeng/panel';
import { Plpt2InputComponent } from './plpt2-input/plpt2-input.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    CurrencyMaskModule,

    InputMaskModule,
    InputTextareaModule,
    InputTextModule,
    TooltipModule,
    ToolbarModule,
    TableModule,
    ButtonModule,
    DialogModule,
    TabViewModule,
    DropdownModule,
    CheckboxModule,
    CalendarModule,
    MultiSelectModule,
    AccordionModule,
    ScrollPanelModule,
    KeyFilterModule,
    PanelModule ,


    MaintenanceModule,
  ],
  declarations: [AdvanceComponent, RescissionComponent, VacationComponent, PayrollComponent, PayrollDetailComponent, PaymentComponent, PaymentSalaryComponent, Plpt2Component, AdvanceInputComponent, VacationInputComponent, Plpt2InputComponent],
  exports: [AdvanceComponent, RescissionComponent, VacationComponent, PayrollComponent, PayrollDetailComponent, PaymentComponent, PaymentSalaryComponent, Plpt2Component]
})
export class MovementModule { }
