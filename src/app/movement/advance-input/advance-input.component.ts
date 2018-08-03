import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { CompanyService } from '../../maintenance/services/company.service';
import { Company, Employee } from '../../core/model';
import { HandlerService } from '../../core/services/handler.service';
import { AdvanceService } from '../services/advance.service';
import { EmployeeFilter, EmployeeService } from '../../maintenance/services/employee.service';
import { ConfirmationService } from 'primeng/api';
import { ToastyService } from 'ng2-toasty';


@Component({
  selector: 'app-advance-input',
  templateUrl: './advance-input.component.html',
  styleUrls: ['./advance-input.component.css']
})
export class AdvanceInputComponent implements OnInit, OnDestroy {

  @Output() objectAddedInput = new EventEmitter();
  @Output() hideComponentInput = new EventEmitter();
  @Input() closeAfterSaveInput: boolean;
  @Input() employee: Employee;
  @Input() referenceMonthInput: Date;
  @Input() objectCodeInput: number;

  readonlyEmployeFields: boolean;

  formInput: FormGroup;
  employees: Employee[];
  companies: Company[];
  company: Company;
  saved: boolean;

  constructor(
    private companyService: CompanyService,
    private employeeService: EmployeeService,
    private advanceService: AdvanceService,
    private handler: HandlerService,
    private confirmation: ConfirmationService,
    private toasty: ToastyService,
    private formBuilder: FormBuilder) { }


  ngOnInit() {
    this.listCompany();
    this.prepareForm();
    setTimeout(() => {
      this.patchForm();
    }, 200);
  }

  ngOnDestroy() {
  }

  // Oculta o dialog de input da ordem
  hidenDialogInput() {
    this.trace('hidenDialogInput');

    this.ngOnDestroy();
    if (this.saved) {
      this.hideComponentInput.emit();
      return;
    }

    this.confirmation.confirm({
      message: 'Deseja fechar a janela sem salvar?',
      accept: () => {
        this.hideComponentInput.emit();
      }
    });
  }

  // Realiza o input do registro na API
  save() {
    this.trace('save');

    if (this.editing) {
      this.edit();
    } else {
      this.add();
    }
    this.saved = true;
  }

  changeCompany() {
    this.trace('changeCompany');
    this.listEmployee();
  }

  private listCompany() {
    this.trace('listCompany');
    this.companyService.list(true)
      .then(result => {
        this.companies = result;
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  private listEmployee() {
    this.trace('listEmployee');
    const filter = new EmployeeFilter;
    filter.status = true;
    if (this.company) {
      filter.idCompany = this.company.code;
    }
    this.employeeService.list(filter)
      .then(result => {
        this.employees = result;
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  get editing() {
    return Boolean(this.formInput.get('code').value);
  }

  private prepareForm() {
    this.trace('prepareForm');
    this.formInput = this.formBuilder.group({
      code: [],
      status: [],
      referenceMonth: [],
      employee: [],
      amount: [],
      discount: [],
      information: [],
    });
    this.resetForm();
  }

  private resetForm() {
    this.trace('resetForm');
    this.formInput.reset();
    this.company = null;
    this.readonlyEmployeFields = false;
  }

  private patchForm() {
    this.trace('patchForm');

    // Verifica se o employee foi passado
    if (this.employee) {
      this.readonlyEmployeFields = true;
      this.company = this.employee.company;     
      this.listEmployee();
      this.formInput.get('employee').setValue(this.employee);
    } 

    //Existe Adiantamento recupera ele
    if (this.objectCodeInput) {
      this.advanceService.findByCode(this.objectCodeInput)
        .then(result => {
          this.company = result.employee.company;
          this.listEmployee();
          setTimeout(() => {
            this.formInput.patchValue(result);
          }, 20);
        })
        .catch(erro => { this.handler.handleError(erro); });
    }

    this.saved = false;
  }

  private add() {
    this.trace('add');

    //Adiciona o mes referencia do filtro ao objeto a salvar
    this.formInput.get('referenceMonth').setValue(this.referenceMonthInput);

    this.advanceService.save(this.formInput.value)
      .then(advance => {
        this.triggerEvent();
        this.toasty.success('Dados inserido com suesso');
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  private edit() {
    this.trace('edit');

    this.advanceService.edit(this.formInput.value)
      .then(advance => {
        this.formInput.patchValue(advance);
        this.triggerEvent();
        this.toasty.success('Dados alterado com suesso');
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  private triggerEvent() {
    this.trace('triggerEvent');
    this.objectAddedInput.emit();
    if (this.closeAfterSaveInput) {
      this.hideComponentInput.emit();
    }

  }

  private trace(value: string) {
    console.log('AdvanceInputComponent:' + value);
  }

}
