import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import {AccordionModule} from 'primeng/accordion';

import { EmployeeComponent } from './employee/employee.component';
import { CompanyComponent } from './company/company.component';
import { DatasourceComponent } from './datasource/datasource.component';
import { MetadataComponent } from './metadata/metadata.component';
import { QueryComponent } from './query/query.component';
import { ProfileComponent } from './profile/profile.component';
import { AccountComponent } from './account/account.component';
import { AliquotComponent } from './aliquot/aliquot.component';
import { EmployeeInputComponent } from './employee-input/employee-input.component';
import { CoreModule } from '../core/core.module';
import { ScrollPanelModule } from 'primeng/scrollpanel';

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

  ],
  declarations: [EmployeeComponent, CompanyComponent, DatasourceComponent,
    MetadataComponent, QueryComponent, ProfileComponent, AccountComponent, AliquotComponent, EmployeeInputComponent],
  exports: [EmployeeComponent, CompanyComponent, DatasourceComponent,
    MetadataComponent, QueryComponent, ProfileComponent, AccountComponent,EmployeeInputComponent]
})
export class MaintenanceModule { }
