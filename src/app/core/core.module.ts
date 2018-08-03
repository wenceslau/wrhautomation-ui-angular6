import { MovementModule } from './../movement/movement.module';
import { AliquotService } from './../maintenance/services/aliquot.service';
import { NgModule } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';

import localePt from '@angular/common/locales/pt';

import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenubarModule } from 'primeng/menubar';
import { ConfirmDialogModule } from 'primeng/components/confirmdialog/confirmdialog';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService } from 'primeng/api';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {AccordionModule} from 'primeng/accordion';
import { TooltipModule } from 'primeng/tooltip';
import {PanelModule} from 'primeng/panel';
import {ProgressBarModule} from 'primeng/progressbar';


import { BootstrapModalModule } from 'ng2-bootstrap-modal';

import { ToastyModule } from 'ng2-toasty';
import { JwtHelper } from 'angular2-jwt';

import { NavbarComponent } from './navbar/navbar.component';

import { CoreService } from './services/core.service';
import { HandlerService } from './services/handler.service';
import { QueryService } from './../maintenance/services/query.service';
import { ObjectsService } from '../maintenance/services/objects.service';
import { CompanyService } from '../maintenance/services/company.service';
import { EmployeeService } from '../maintenance/services/employee.service';
import { MetadataService } from './../maintenance/services/metadata.service';
import { DatasourceService } from './../maintenance/services/datasource.service';

import { MessageComponent } from './message/message.component';
import { MaintenanceModule } from '../maintenance/maintenance.module';
import { AuthorizerService } from '../security/authorizer.service';
import { SecurityModule } from '../security/security.module';
import { HeaderComponent } from './header/header.component';
import { AccountService } from '../maintenance/services/account.service';
import { ProfileService } from '../maintenance/services/profile.service';
import { AdvanceService } from '../movement/services/advance.service';
import { RescissionService } from '../movement/services/rescission.service';
import { VacationService } from '../movement/services/vacation.service';
import { HomeComponent } from './home/home.component';
import { PayrollService } from '../movement/services/payroll.service';
import { PaymentService } from '../movement/services/payment.service';
import { Plpt2Service } from '../movement/services/plpt2.service';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ReportModule } from '../report/report.module';
import { ReportService } from '../report/services/report.service';
import { InputTextModule } from 'primeng/inputtext';


registerLocaleData(localePt, 'pt-BR');

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TieredMenuModule,
    MenubarModule,
    ConfirmDialogModule,
    BlockUIModule,
    ProgressSpinnerModule,
    DialogModule,
    AccordionModule,
    TooltipModule,
    PanelModule ,
    ProgressBarModule,
    InputTextModule,

    BootstrapModalModule.forRoot({ container: document.body }),

    ToastyModule.forRoot(),

    MessagesModule,
    MessageModule,

    MaintenanceModule,
    MovementModule,
    SecurityModule
  ],
  declarations: [NavbarComponent, MessageComponent, HeaderComponent, HomeComponent],
  exports: [
    NavbarComponent,      // Exporta os componente desse modulo para ser usado pelo modulos que importa core module
    HeaderComponent,       // --
    MaintenanceModule,     // Exporta o modulo para que ele seja usado pelos modulos que importar Core
    MovementModule,
    ReportModule,
    SecurityModule,         // Exporta o modulo para que ele seja usado pelos modulos que importar Core
    ConfirmDialogModule,   // Exporta o modulo para que ele seja usado pelos modulos que importar Core
    ToastyModule,         // Exporta o module toasty, para ser usado pelos outros modulos
    BlockUIModule,         // Exporta o module para ser usado pelos outros modulos
    ProgressSpinnerModule,
    BootstrapModalModule,
    DialogModule,
    AccordionModule,
    TooltipModule,
    PanelModule,
    ProgressBarModule
  ],
  providers: [
    // Provedor de servicos http criado para acessar a api
    CoreService,
    EmployeeService,
    ObjectsService,
    CompanyService,
    MessageService,
    HandlerService,
    ConfirmationService,
    DatasourceService,
    MetadataService,
    QueryService,
    AuthorizerService,
    ProfileService,
    AccountService,
    AliquotService,
    AdvanceService,
    RescissionService,
    VacationService,
    PayrollService,
    PaymentService,
    Plpt2Service,
    ReportService,
    Plpt2Service,

    JwtHelper,

    // Provedor region
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
})
export class CoreModule { }
