import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ToastyService } from 'ng2-toasty';

import { HandlerService } from '../../core/services/handler.service';
import { PayrollService, PayrollFilter } from './../services/payroll.service';
import { CompanyService } from './../../maintenance/services/company.service';
import { EmployeeService, EmployeeFilter } from './../../maintenance/services/employee.service';

import { Payroll, Company, Employee } from './../../core/model';

import * as moment from 'moment';
import { filter } from 'rxjs/operators';
import { ReportService } from '../../report/services/report.service';

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.css']
})
export class PayrollComponent implements OnInit {

  page = '[ Movimentação / Folha Pagamento ] ';
  month: string;
  year: string;
  canClose: boolean;
  canPrint: boolean;
  isPayrollClosed: boolean;       // define se a folha corrente esta aberta 
  companies: Company[];
  displayInput: boolean;
  idDialogInput: number;

  months = [
    { label: 'Janeiro', value: '1' },
    { label: 'Fevereiro', value: '2' },
    { label: 'Março', value: '3' },
    { label: 'Abril', value: '4' },
    { label: 'Maio', value: '5' },
    { label: 'Junho', value: '6' },
    { label: 'Julho', value: '7' },
    { label: 'Agosto', value: '8' },
    { label: 'Setembro', value: '8' },
    { label: 'Outubro', value: '10' },
    { label: 'Novembro', value: '11' },
    { label: 'Dezembro', value: '12' },
  ];

  constructor(
    private payrollService: PayrollService,
    private reportService: ReportService,
    public handler: HandlerService,
    private companyService: CompanyService,
    private employeeService: EmployeeService,
    private confirmation: ConfirmationService,
    private toasty: ToastyService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.handler.setNavigation(this.page);
    this.handler.setInfoMessage('');
    this.isPayrollClosed = true;
    this.canClose = false;
    this.month = this.handler.month;
    this.year = this.handler.year;
  }

  search() {
    this.trace('search');
    this.canClose = false;
    this.companies = [];
    this.checkPreviousPayroll();
  }

  generateReport() {
    this.trace('generateReport');

    this.reportService.payrollReport(this.getReferenceMonth())
      .then(relatorio => {
        const uri = window.URL.createObjectURL(relatorio);
        this.trace('URI > ' + uri);
        window.open(uri);
        // this.pdfSrc = uri;
        // setTimeout(() => {
        //   this.rerender = true;
        // }, 100);
      });
  }

  close() {

    this.confirmation.confirm({
      message: 'Confirma a fechamento da folha de pagamento ' + this.month + '/' + this.year + '? ' +
        'Após o fechamento da folha não é permitido realizar nenhuma alteração. ' +
        'Verfifique se o contas a pagar ja foi lançado.',
      accept: () => {
        this.payrollService.close(this.getReferenceMonth())
          .then(result => {
            this.handler.setInfoMessage(result.value);
            this.isPayrollClosed = true;
            this.canClose = false;
            this.listCompany();
          })
          .catch(erro => {
            this.handler.handleError(erro);
          });
      }
    });


  }

  getReferenceMonth(): Date {
    if (this.month && this.year) {
      this.handler.month = this.month;
      this.handler.year = this.year;
      return moment(this.year + '-' + this.month + '-1', 'YYYY-MM-DD').toDate();
    }
  }

  // Verifica se a folha do mes anterior esta abert
  private checkPreviousPayroll(): Boolean {
    this.trace('checkPreviousPayroll');


    this.payrollService.closedPrevious(this.getReferenceMonth())
      .then(result => {
        // todas as folha anteriores estao fechadas
        if (result.status) {
          this.checkAfterPayroll();
        } else {
          this.handler.setInfoMessage(result.value);
          this.handler.showDialogInfo(result.value + ' é necessario fecha-la para iniciar outra');

        }
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });

    return true;
  }

  // Verifica se e tentativa de criar folha retroativa
  private checkAfterPayroll(): Boolean {
    this.trace('checkAfterPayroll');

    this.payrollService.after(this.getReferenceMonth())
      .then(result => {
        // tentativa de criar folha retroativa
        if (result.status) {
          this.handler.setInfoMessage(result.value);
          this.handler.showDialogInfo(result.value);
        } else {
          this.checkPayroll();
        }
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });

    return true;
  }

  // verifica se a folha do mes informado esta aberta. Bloqueia alteracao se estiver fechada
  private checkPayroll() {
    this.trace('checkPayroll');

    this.payrollService.closed(this.getReferenceMonth())
      .then(result => {
        this.handler.setInfoMessage(result.value);
        this.isPayrollClosed = result.status;
        this.canClose = !this.isPayrollClosed;
        this.canPrint = true;
        //Carrega as empresas, que carregara as folha
        this.listCompany();
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  // Retorna a lista de empresas para criar as tab
  private listCompany() {
    this.trace('listCompany');
    this.companyService.list(true)
      .then(result => {
        this.companies = result;
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  private trace(value: string) {
    console.log('PayrollComponent:' + value);
  }
}
