import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ToastyService } from 'ng2-toasty';

import { HandlerService } from '../../core/services/handler.service';
import { AdvanceService, AdvanceFilter } from './../services/advance.service';
import { CompanyService } from './../../maintenance/services/company.service';
import { EmployeeService, EmployeeFilter } from './../../maintenance/services/employee.service';

import { Advance, Company, Employee } from './../../core/model';

import * as moment from 'moment';
import { PayrollService, PayrollFilter } from '../services/payroll.service';

@Component({
  selector: 'app-advance',
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.css']
})
export class AdvanceComponent implements OnInit {

  page = '[ Movimentação / Adiantamento ] ';

  month: string;
  year: string;

  closeComponentInputAfterSave: boolean;
  displayComponentInput: boolean;        // Exibe o component de input
  objectCode: number;

  isPayrollClosed: boolean;       // Identifica se a folha corrente esta aberta 
  totalRecords: number;         // Numero de registro da lista
  advances: Advance[];
  filter: AdvanceFilter;

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
    private advanceService: AdvanceService,
    public handler: HandlerService,
    private payrollService: PayrollService,
    private confirmation: ConfirmationService,
    private toasty: ToastyService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.closeComponentInputAfterSave = false;
    this.displayComponentInput = false;
    this.isPayrollClosed = true;
    this.month = this.handler.month;
    this.year = this.handler.year;
    this.filter = new AdvanceFilter;
    this.filter.referenceMonth = this.getReferenceMonth();
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
    this.listAdvance();
  }

  confirmDelete(code: number) {
    this.trace('confirmDelete');

    this.confirmation.confirm({
      message: 'Deseja confirmar a exclusão',
      accept: () => {
        this.deleteAdvance(code);
      }
    });
  }

  addedObjectEvent() {
    this.trace('addedObjectEvent');
    this.listAdvance();
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

  private checkPayroll() {
    this.trace('checkPayroll');

    this.payrollService.closed(this.getReferenceMonth())
      .then(result => {
        this.handler.setInfoMessage(result.value);
        this.isPayrollClosed = result.status;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  private listAdvance() {
    this.trace('listAdvance');

    this.filter.referenceMonth = this.getReferenceMonth();
    this.advanceService.list(this.filter)
      .then(result => {
        this.advances = result;
        this.totalRecords = this.advances.length;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  private deleteAdvance(code: number) {
    this.trace('deleteAdvance');
    this.advanceService.delete(code)
      .then(result => {
        this.listAdvance();
        this.toasty.success('Objeto deletado com suesso');
      }).catch(erro => { this.handler.handleError(erro); });
  }

  private trace(value: string) {
    console.log('AdvanceComponent:' + value);
  }

}