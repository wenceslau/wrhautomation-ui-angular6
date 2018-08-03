import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ToastyService } from 'ng2-toasty';

import { HandlerService } from '../../core/services/handler.service';
import { Plpt2Service, Plpt2Filter } from './../services/plpt2.service';
import { CompanyService } from './../../maintenance/services/company.service';
import { EmployeeService, EmployeeFilter } from './../../maintenance/services/employee.service';

import { Plpt2, Company, Employee } from './../../core/model';

import * as moment from 'moment';
import { PayrollService, PayrollFilter } from '../services/payroll.service';

@Component({
  selector: 'app-plpt2',
  templateUrl: './plpt2.component.html',
  styleUrls: ['./plpt2.component.css']
})
export class Plpt2Component implements OnInit {

  page = '[ Movimentação / PLpt2 ] ';
  month: string;
  year: string;

  referenceMonth: Date;

  closeComponentInputAfterSave: boolean;
  displayComponentInput: boolean;        // Exibe o component de input
  objectCode: number;

  isPayrollClosed: boolean;       // Identifica se a folha corrente esta aberta 
  totalRecords: number;         // Numero de registro da lista

  plpt2s: Plpt2[];
  companies: Company[];
  employees: Employee[];
  company: Company;
  filter: Plpt2Filter;

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
    private plpt2Service: Plpt2Service,
    public handler: HandlerService,
    private payrollService: PayrollService,
    private confirmation: ConfirmationService,
    private toasty: ToastyService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.isPayrollClosed = true;
    this.month = this.handler.month;
    this.year = this.handler.year;
    this.filter = new Plpt2Filter();
    this.handler.setInfoMessage('');
    this.handler.setNavigation(this.page);
  }

  showComponentInput(code: number) {
   this.trace('showComponentInput');
    this.hideComponentInputEvent();
    setTimeout(() => {
      this.objectCode = code;
      this.displayComponentInput = true;
    }, 100);
  }

  search() {
   this.trace('search');
   this.checkPayroll()
    this.listPlpt2();
  }

  confirmDelete(code: number) {
    this.confirmation.confirm({
      message: 'Deseja confirmar a exclusão',
      accept: () => {
        this.deletePlpt2(code);
      }
    });
  }

  addedObjectEvent() {
   this.trace('addedObjectEvent');
    this.listPlpt2();
  }

  hideComponentInputEvent() {
   this.trace('hideComponentInputEvent');
    this.displayComponentInput = false;
  }

  getReferenceMonth(): Date {
    if (this.month && this.year) {
      this.handler.month = this.month;
      this.handler.year = this.year;
      return moment(this.year + '-' + this.month + '-1', 'YYYY-MM-DD').toDate();
    }
  }

  // verifica se a folha do mes informado esta aberta. Bloqueia alteracao se estiver fechada
  private checkPayroll() {
    this.trace('checkPayroll');
    this.payrollService.closed(this.referenceMonth)
      .then(result => {
        this.handler.setInfoMessage(result.value);
        this.isPayrollClosed = result.status;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  private listPlpt2() {
   this.trace('listPlpt2');

    this.filter.referenceMonth = this.getReferenceMonth();
    this.plpt2Service.list(this.filter)
      .then(result => {
        this.plpt2s = result;
        this.totalRecords = this.plpt2s.length;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  private deletePlpt2(code: number) {

    this.plpt2Service.delete(code)
      .then(result => {
        this.listPlpt2();
        this.toasty.success('Objeto deletado com suesso');
      }).catch(erro => { this.handler.handleError(erro); });
  }


  private trace(value: string) {
    console.log('Plpt2Component:' + value);
  }

}
