import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ToastyService } from 'ng2-toasty';

import { HandlerService } from '../../core/services/handler.service';
import { VacationService, VacationFilter } from './../services/vacation.service';
import { CompanyService } from './../../maintenance/services/company.service';
import { EmployeeService, EmployeeFilter } from './../../maintenance/services/employee.service';

import { Vacation, Company, Employee } from './../../core/model';

import * as moment from 'moment';
import { PayrollService, PayrollFilter } from '../services/payroll.service';

@Component({
  selector: 'app-vacation',
  templateUrl: './vacation.component.html',
  styleUrls: ['./vacation.component.css']
})
export class VacationComponent implements OnInit {

  closeComponentInputAfterSave: boolean;
  displayComponentInput: boolean;        // Exibe o component de input
  objectCode: number;

  page = '[ Movimentação / Ferias ] ';
  statusPayroll: string;
  month: string;
  year: string;

  isPayrollClosed: boolean;       // Identifica se a folha corrente esta aberta 
  totalRecords: number;         // Numero de registro da lista

  vacations: Vacation[];
  filter: VacationFilter;

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
    private vacationService: VacationService,
    public handler: HandlerService,
    private payrollService: PayrollService,
    private confirmation: ConfirmationService,
    private toasty: ToastyService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.totalRecords = 0;
    this.isPayrollClosed = true;
    this.month = this.handler.month;
    this.year = this.handler.year;
    this.filter = new VacationFilter;
    this.handler.setNavigation(this.page);
    this.handler.setInfoMessage('');
  }

  search() {
    this.trace('search');
    this.checkPayroll()
    this.listVacation();
  }

   confirmDelete(code: number) {
    this.trace('confirmDelete');

    this.confirmation.confirm({
      message: 'Deseja confirmar a exclusão',
      accept: () => {
        this.deleteVacation(code);
      }
    });
  }

  showComponentInput(code: number) {
    this.trace('showComponentInput');
    this.hideComponentInputEvent();
    setTimeout(() => {
      this.objectCode = code;
      this.displayComponentInput = true;
    }, 100);
  }

  totalReceive(vacation: Vacation) {
    return Number(
      (vacation.amountVacation + vacation.amoutThird) -
      (vacation.familySalary + vacation.inss + vacation.irrf)
    );
  }
  addedObjectEvent() {
    this.trace('addedObjectEvent');
    this.listVacation();
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

    this.payrollService.closed(this.getReferenceMonth())
      .then(result => {
        this.handler.setInfoMessage(result.value);
        this.isPayrollClosed = result.status;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

 
  private listVacation() {
    this.trace('listVacation');

    this.filter.referenceMonth = this.getReferenceMonth();
    this.vacationService.list(this.filter)
      .then(result => {
        this.vacations = result;
        this.totalRecords = this.vacations.length;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }
  private deleteVacation(code: number) {
    this.trace('deleteVacation');

    this.vacationService.delete(code)
      .then(result => {
        this.listVacation();
        this.toasty.success('Objeto deletado com suesso');
      }).catch(erro => { this.handler.handleError(erro); });
  }

  private trace(value: string) {
    console.log('VacationComponent:' + value);
  }
}
