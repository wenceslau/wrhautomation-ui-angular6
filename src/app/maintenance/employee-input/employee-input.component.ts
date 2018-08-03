import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { CompanyService } from '../../maintenance/services/company.service';
import { Company, Employee, Person } from '../../core/model';
import { HandlerService } from '../../core/services/handler.service';
import { EmployeeFilter, EmployeeService } from '../../maintenance/services/employee.service';
import { ConfirmationService } from 'primeng/api';
import { ToastyService } from 'ng2-toasty';
import { ObjectsService } from '../services/objects.service';


@Component({
  selector: 'app-employee-input',
  templateUrl: './employee-input.component.html',
  styleUrls: ['./employee-input.component.css']
})
export class EmployeeInputComponent implements OnInit, OnDestroy {

  @Output() objectAddedInput = new EventEmitter();
  @Output() hideComponentInput = new EventEmitter();
  @Input() closeAfterSaveInput: boolean;
  @Input() objectCodeInput: number;

  resultEmploye: any;

  formInput: FormGroup;
  saved: boolean;

  readonlyFixedSalary: boolean;
  readonlySalesExternalCode: boolean;
  readonlyGarantia: boolean;
  readonlySupplierExternalCode: boolean;
  readonlyQuebraCaixa: boolean;

  suppliers = [];               // Lista de fornecedores
  salesmans = [];               // Lista de acessores
  companies: Company[];

  positions = [
    { label: 'Assessor', value: 'ASSESSOR' },
    { label: 'Gerente', value: 'GERENTE' },
    { label: 'Coordenador Financeiro', value: 'CORD_FINAN' },
    { label: 'Auxiliar Financeiro', value: 'AUX_FINAN' },
    { label: 'Auxiliar Escritorio', value: 'AUX_ESCR' },
    { label: 'Auxiliar Admistrativo', value: 'AUX_ADM' },
    { label: 'Caixa', value: 'CAIXA' },
    { label: 'Office-Boy', value: 'OFF_BOY' },
    { label: 'Socio', value: 'SOCIO' },
  ];

  situations = [
    { label: 'Ativo', value: 'ATIVO' },
    { label: 'Inativo', value: 'INATIVO' },
    { label: 'Afastado', value: 'AFASTADO' },
    { label: 'Maternidade', value: 'MATERNIDADE' },
  ];

  salaries = [
    { label: 'Fixo', value: 'FIXO' },
    { label: 'Comissionado', value: 'COMISSIONADO' },
    { label: 'Fixo/Comissionado', value: 'FIXO_COMISSIONADO' },
    { label: 'Pro-Labore', value: 'PRO_LABORE' },
    { label: 'Dist. Lucro', value: 'DIST_LUCRO' },
  ];

  payments = [
    { label: 'Especie', value: 'DINHEIRO' },
    { label: 'Cheque', value: 'CHEQUE' },
    { label: 'Conta Salario', value: 'CONTA_SALARIO' },
    { label: 'Conta Corrente', value: 'CONTA_CORRENTE' }
  ];


  constructor(
    private companyService: CompanyService,
    private employeeService: EmployeeService,
    private objectService: ObjectsService,
    private handler: HandlerService,
    private confirmation: ConfirmationService,
    private toasty: ToastyService,
    private formBuilder: FormBuilder) { }


  ngOnInit() {
    this.listCompany();
    this.prepareForm();
    this.patchForm();
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

    if (this.formInput.get('monthlyHourlyLoad').value === 0) {
      this.handler.showDialogError("O valor da carga horária não pode ser zero", null);
      return;
    }

    if (this.editing) {
      this.edit();
    } else {
      this.add();
    }
    this.saved = true;
  }

  changeCompany() {
    this.trace('changeCompany');
    // Se nao estiver bloqueado, carrega
    if (!this.readonlySalesExternalCode) {
      const company = this.formInput.get('company').value;
      this.listSalesman(company);
    }
    // Se tiver valor limpa
    if (this.formInput.get('salesExternalCode').value) {
      this.formInput.get('salesExternalCode').setValue(null);
    }
  }

  // Evento de mudanca do combo de posicao
  changePosition(clearValue: boolean) {
    this.trace('changePosition');

    //Lima o campo se for necessario
    if (clearValue) {
      this.formInput.get('quebraCaixa').setValue(null);
    }

    // Bloqueia o campo
    this.readonlyQuebraCaixa = true;

    if (this.formInput.get('position').value === 'CAIXA') {
      //Desbloqueia se for caixa
      this.readonlyQuebraCaixa = false;
    }
  }

  // Evento de mudanca do combo de tipo de salario
  changeSalary(clearValue: boolean) {
    this.trace('changeSalary');

    // limpa o campo se for necessario
    if (clearValue) {
      this.formInput.get('garantia').setValue(null);
      this.formInput.get('fixedSalary').setValue(null);
      this.formInput.get('salesExternalCode').setValue(null);
    }

    // Padrao, bloqueia
    this.readonlySalesExternalCode = true;
    this.readonlyGarantia = true;
    this.readonlyFixedSalary = true;

    if (this.formInput.get('salary').value === 'COMISSIONADO'
      || this.formInput.get('salary').value === 'FIXO_COMISSIONADO') {
      // Carrega a lista e desloqueia
      this.readonlySalesExternalCode = false;
      this.readonlyGarantia = false;

      const company = this.formInput.get('company').value;
      // apenas recarrega os vendedor se for mudanca na tela
      if (clearValue) {
        this.listSalesman(company);
      }
    }

    if (this.formInput.get('salary').value === 'FIXO'
      || this.formInput.get('salary').value === 'FIXO_COMISSIONADO'
      || this.formInput.get('salary').value === 'PRO_LABORE'
      || this.formInput.get('salary').value === 'DIST_LUCRO') {
      //Desbloqueia     
      this.readonlyFixedSalary = false;
    }
  }

  // Evento de mudanca do combo de tipo de pagamento
  changePayment(clearValue: boolean) {
    this.trace('changePayment');
    // Lima o campo se for necessario
    if (clearValue) { this.formInput.get('supplierExternalCode').setValue(null); }

    // Padrao, bloqueia  
    this.readonlySupplierExternalCode = true;

    if (this.formInput.get('payment').value !== 'CONTA_SALARIO') {
      // Carrega a lista de desbloqueia
      const person = this.formInput.get('person').value;
      //apenas recarrega o fornacedor se for mudança na tela
      if (clearValue) {
        this.listSupplier(person);
      }
      this.readonlySupplierExternalCode = false;
    }
  }

  private listCompany() {
    this.trace('listCompany');
    this.companyService.list(null)
      .then(result => {
        this.companies = result;
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  private listSalesman(company: Company) {
    this.trace('listSalesman');
    if (company) {
      this.objectService.listSalesman(company.externalCode)
        .then(result => {
          this.salesmans = result.map(slm => ({
            label: slm.nickname,
            value: slm.id
          }));
        })
        .catch(erro => { this.handler.handleError(erro); });
    }
  }

  private listSupplier(person: Person) {
    this.trace('listSupplier');
    this.objectService.listSupplier(person.name, person.nickname)
      .then(result => {
        this.suppliers = result.map(slm => ({
          label: slm.businessName,
          value: slm.id
        }));
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
      status: [true],
      person: this.formBuilder.group({
        cpf: [],
        rg: [],
        name: [],
        nickname: [],
        dateOfBirth: [],
        address: this.formBuilder.group({
          logradouro: [],
          neighborhood: [],
          cep: [],
          city: [],
          stateOfCity: [],
        }),
        phone: [],
        mobilePhone: [],
        email: [],
        information: [],
      }),
      company: [],
      position: [],
      dateOfHiring: [],
      situation: [],
      salary: [],
      payment: [],
      salesExternalCode: [],
      supplierExternalCode: [],
      fixedSalary: [],
      lpt2Salary: [],
      quebraCaixa: [],
      garantia: [],
      transportVoucher: [],
      numDependentIrrf: [],
      numDependentFamilySalary: [],
      monthlyHourlyLoad: []
    });

    this.resetForm();
  }

  private resetForm() {
    this.trace('resetForm');
    this.formInput.reset();
    this.formInput.get('transportVoucher').setValue(false);
    this.readonlyFixedSalary = true;
    this.readonlySalesExternalCode = true;
    this.readonlyGarantia = true;
    this.readonlySupplierExternalCode = true;
    this.readonlyQuebraCaixa = true;
  }

  private patchForm() {
    this.trace('patchForm');

    this.resetForm();

    if (this.objectCodeInput) {
      this.employeeService.findByCode(this.objectCodeInput)
        .then(result => {

          this.resultEmploye = result;
          // Se existe  assessor vinculado carrega a lista
          if (result.salesExternalCode) {
            this.listSalesman(result.company);
          }

          // Se existe fornecedor vinculado carrega a lista
          if (result.supplierExternalCode) {
            this.listSupplier(result.person);
          }
          this.handler.block(); 
          setTimeout(() => {
            this.formInput.patchValue(this.resultEmploye);
            this.afterPatchForm();
            this.handler.unblock(); 
          }, 500);
        })
        .catch(erro => { this.handler.handleError(erro); });
    }
    this.saved = false;
  }

  private afterPatchForm() {
    this.trace('afterPatchForm');
    this.changePosition(false);
    this.changeSalary(false);
    this.changePayment(false);
  }

  private add() {
    this.trace('add');

    this.employeeService.save(this.formInput.value)
      .then(employee => {
        this.triggerEvent(employee);
        this.toasty.success('Dados inserido com suesso');
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  private edit() {
    this.trace('edit');
    this.employeeService.edit(this.formInput.value)
      .then(employee => {
        this.formInput.patchValue(employee);
        this.triggerEvent(employee);
        this.toasty.success('Dados alterado com suesso');
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  private triggerEvent(employee: Employee) {
    this.trace('triggerEvent');
    this.objectAddedInput.emit(employee);
    if (this.closeAfterSaveInput) {
      this.hideComponentInput.emit();
    }
  }

  private trace(value: string) {
    console.log('EmployeeInputComponent:' + value);
  }

}

