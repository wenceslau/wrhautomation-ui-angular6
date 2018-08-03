import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ToastyService } from 'ng2-toasty';

import { HandlerService } from '../../core/services/handler.service';
import { PaymentService, PaymentFilter } from './../services/payment.service';
import { CompanyService } from './../../maintenance/services/company.service';
import { EmployeeService, EmployeeFilter } from './../../maintenance/services/employee.service';

import { Payment, Company, Employee } from './../../core/model';

import * as moment from 'moment';
import { PayrollService, PayrollFilter } from '../services/payroll.service';
import { ReportService } from '../../report/services/report.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  formPayment: FormGroup;

  page = '[ Movimentação / Contas Pagar ] ';

  month: string;
  year: string;

  isPayrollClosed: boolean;
  rerender = false;

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
    private paymentService: PaymentService,
    private reportService: ReportService,
    public handler: HandlerService,
    private payrollService: PayrollService,
    private confirmation: ConfirmationService,
    private toasty: ToastyService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.handler.canPrintPayment = false;
    this.isPayrollClosed = true;
    this.month = this.handler.month;
    this.year = this.handler.year;
    this.handler.setInfoMessage('');
    this.handler.setNavigation(this.page);
  }

  search() {
    this.trace('search');
    this.checkPayroll();
    this.rendered();
  }

  getReferenceMonth(): Date {
    if (this.month && this.year) {
      this.handler.month = this.month;
      this.handler.year = this.year;
      return moment(this.year + '-' + this.month + '-1', 'YYYY-MM-DD').toDate();
    }
  }

  private rendered() {
    this.rerender = false;
    setTimeout(() => {
      this.rerender = true;
    }, 100);
  }

  generateReport() {
    this.trace('generateReport');

    this.reportService.paymentReport(this.getReferenceMonth())
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

  // verifica se a folha do mes informado esta aberta. Bloqueia alteracao se estiver fechada
  private checkPayroll() {
    this.trace('checkPayroll');
    this.payrollService.closed(this.getReferenceMonth())
      .then(result => {
        this.handler.setInfoMessage(result.value);
        this.isPayrollClosed = result.status;
        this.handler.canPrintPayment = this.isPayrollClosed;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  private trace(value: string) {
    console.log('Plpt2Component:' + value);
  }

}

