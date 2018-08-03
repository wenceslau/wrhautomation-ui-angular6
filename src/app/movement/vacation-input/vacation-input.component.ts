import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { CompanyService } from '../../maintenance/services/company.service';
import { Company, Employee } from '../../core/model';
import { HandlerService } from '../../core/services/handler.service';
import { VacationService } from '../services/vacation.service';
import { EmployeeFilter, EmployeeService } from '../../maintenance/services/employee.service';
import { ConfirmationService } from 'primeng/api';
import { ToastyService } from 'ng2-toasty';


@Component({
  selector: 'app-vacation-input',
  templateUrl: './vacation-input.component.html',
  styleUrls: ['./vacation-input.component.css']
})
export class VacationInputComponent implements OnInit, OnDestroy {

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
    private vacationService: VacationService,
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

  onChangeManualInput() {
    this.trace('onChangeManualInput');
    if (this.formInput.get('manualInput').value) {

      this.confirmation.confirm({
        message: 'Esta opção desativa todo cálculo de férias deste colaborador. ' +
          'Todos os campos devem ser preenchidos manualmente. ' +
          'Continuar?',
        reject: () => {
          this.formInput.get('manualInput').setValue(false);
        }
      });
    }
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
      initialReference: [],
      finalReference: [],
      initialEnjoy: [],
      finalEnjoy: [],
      amountVacation: [],
      amoutThird: [],
      daysOfVacation: [],
      familySalary: [],
      inss: [],
      irrf: [],
      manualInput: []
    });
    this.resetForm();
  }

  private resetForm() {
    this.trace('resetForm');
    this.formInput.reset();
    this.formInput.get('manualInput').setValue(false);
    this.formInput.get('status').setValue(true);
    this.onChangeManualInput();
    this.company = null;
    this.readonlyEmployeFields = false
  }

  private patchForm() {
    this.trace('patchValue');

    // Verifica se o employee foi passado
    if (this.employee) {
      this.readonlyEmployeFields = true;
      this.company = this.employee.company;
      this.listEmployee();
      this.formInput.get('employee').setValue(this.employee);
    }

    if (this.objectCodeInput) {
      this.vacationService.findByCode(this.objectCodeInput)
        .then(result => {

          this.referenceMonthInput = result.referenceMonth;
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

    this.vacationService.save(this.formInput.value)
      .then(vacation => {
        this.objectCodeInput = vacation.code;
        console.log(JSON.stringify(vacation));
        this.triggerEvent();
        this.patchForm();
        //this.formInput.patchValue(vacation);
        this.toasty.success('Dados inserido com suesso');
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  private edit() {
    this.trace('edit');

    this.vacationService.edit(this.formInput.value)
      .then(vacation => {
        console.log(JSON.stringify(vacation));
        this.triggerEvent();
        this.formInput.patchValue(vacation);
        this.toasty.success('Dados alterado com suesso');
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  private triggerEvent() {
    this.objectAddedInput.emit();
    if (this.closeAfterSaveInput) {
      this.hideComponentInput.emit();
    }

  }

  private trace(value: string) {
    console.log('VacationInputComponent:' + value);
  }
  
}
