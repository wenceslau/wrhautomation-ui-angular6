import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { HandlerService } from './../../core/services/handler.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Employee, Company, Person } from './../../core/model';
import { EmployeeFilter } from './../services/employee.service';
import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { Jsonp } from '@angular/http';
import { CompanyService } from '../services/company.service';
import { DISABLED } from '@angular/forms/src/model';
import { ObjectsService } from '../services/objects.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService } from 'primeng/api';
import { ToastyService } from 'ng2-toasty';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  closeComponentInputAfterSave: boolean;
  displayComponentInput: boolean;        // Exibe o component de input
  objectCode: number;

  employees: Employee[];        // Lista de objetos do grig
  totalRecords: number;         // Numero de registro da lista
  displaySearch: boolean;       // Exibe o dialog de filter
  formFilter: FormGroup;
  page = '[ Manutenção / Colaborador ] ';
  nameSearch: string;


  situations = [
    { label: 'Ativo', value: 'ATIVO' },
    { label: 'Inativo', value: 'INATIVO' },
    { label: 'Afastado', value: 'AFASTADO' },
    { label: 'Maternidade', value: 'MATERNIDADE' },
  ];

  constructor(
    private employeeService: EmployeeService,
    private companyService: CompanyService,

    private messageService: MessageService,
    public handler: HandlerService,
    private confirmation: ConfirmationService,
    private toasty: ToastyService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.initListEmployee();
    this.prepareForm();
    this.handler.setNavigation(this.page);
    this.handler.setInfoMessage('');
  }

  // Mostra o dialog de pesquisa
  showDialogFilter() {
    this.trace('showDialogFilter');
    this.nameSearch = null;
    this.formFilter.reset();
    this.displaySearch = true;
  }

  // Oculta o dialog de pesquisa
  hidenDialogFilter() {
    this.trace('hidenDialogFilter');
    this.displaySearch = false;
  }

  // Limpar a ultima pesquisa
  initListEmployee() {
    this.trace('initListSales');
    this.listEmployee(null);
  }

  filterEmployee() {
    this.trace('filterEmployee');
    if (this.nameSearch) {
      this.formFilter.get('name').setValue(this.nameSearch);
    }
    this.listEmployee(this.formFilter.value);
    this.hidenDialogFilter();
  }

  showComponentInput(code: number) {
    this.trace('showDialogInput');
    this.hideComponentInputEvent();
    setTimeout(() => {
      this.objectCode = code;
      this.displayComponentInput = true;
    }, 100);
  }

  addedObjectEvent() {
    this.trace('addedObjectEvent');
    this.listEmployee(this.formFilter.value);
  }

  hideComponentInputEvent() {
    this.trace('hideComponentInputEvent');
    this.displayComponentInput = false;
  }

  private prepareForm() {
    this.trace('prepareForm');
    this.formFilter = this.formBuilder.group({
      code: [],
      cpf: [],
      rg: [],
      name: [],
      nickname: [],
      dateOfBirth: [],
      phone: [],
      mobilePhone: [],
      email: [],
      idCompany: [],
      nameCompany: [],
      position: [],
      dateOfHiringFrom: [],
      dateOfHiringTo: [],
      situation: [], // Ativo, Inativo, Licença Maternidade, Afastado
      payment: [], // "Dinheiro", "Cheque", "Conta Salario"
      salary: [], // "Fixo", "Comissionado", "Fixo/Comissionado"
      remunaration: [], // "Fixo", "Comissionado", "Fixo/Comissionado"
      fixedSalaryFrom: [],
      fixedSalaryTo: [],
      transportVoucher: [],
      status: [],
    });
  }

  private listEmployee(filter: EmployeeFilter) {
    this.trace('listEmployee');

    if (!filter) {
      filter = new EmployeeFilter;
      filter.situation = 'ATIVO'
    }

    this.employeeService.list(filter)
      .then(result => {

        this.employees = result;
        this.totalRecords = this.employees.length;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  private trace(value: string) {
    console.log('EmployeeComponent:' + value);
  }

}
