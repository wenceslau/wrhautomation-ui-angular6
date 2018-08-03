import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ToastyService } from 'ng2-toasty';

import { HandlerService } from '../../../core/services/handler.service';
import { PayrollService, PayrollFilter } from './../../services/payroll.service';
import { CompanyService } from './../../../maintenance/services/company.service';
import { EmployeeService, EmployeeFilter } from './../../../maintenance/services/employee.service';

import { Payroll, Company, Employee } from './../../../core/model';

import * as moment from 'moment';
import { AdvanceService, AdvanceFilter } from '../../services/advance.service';
import { VacationFilter, VacationService } from '../../services/vacation.service';
import { Plpt2Filter, Plpt2Service } from '../../services/plpt2.service';


@Component({
  selector: 'app-payroll-detail',
  templateUrl: './payroll-detail.component.html',
  styleUrls: ['./payroll-detail.component.css']
})
export class PayrollDetailComponent implements OnInit {

  formPayroll: FormGroup;

  @Input() referenceMonth: Date;
  @Input() isPayrollClosed: boolean;
  @Input() idCompany: number;

  closeComponentInputAfterSave: boolean = false;
  displayAdvanceInput: boolean;
  displayEmployeeInput: boolean;
  displayVacationInput: boolean;
  displayPlpt2Input: boolean;
  advanceCode: number;
  employeeCode: number;
  vacationCode: number;
  plpt2Code: number;

  saved: boolean;               // Usada para emitir msg de fechamento sem salvar
  displayInput: boolean;        // Exibe o dialog de input
  totalRecords: number;         // Numero de registro da lista

  employee: Employee;
  payrolls: Payroll[];
  filter: PayrollFilter;

  constructor(
    private payrollService: PayrollService,
    private vacationService: VacationService,
    private advanceService: AdvanceService,
    private plpt2Service: Plpt2Service,
    private handler: HandlerService,
    private confirmation: ConfirmationService,
    private toasty: ToastyService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.totalRecords = 0;
    this.filter = new PayrollFilter;
    this.displayInput = false;
    this.filter.idCompany = this.idCompany;
    this.filter.referenceMonth = this.referenceMonth;
    this.prepareForm();
    this.findPayrolls();
  }

  showEmployeeInput(code: number) {
    this.trace('showEmployeeInput');
    this.hideComponentInputEvent();
    this.employeeCode = code;
    this.displayEmployeeInput = true;
  }

  showAdvanceInput(code: number) {
    this.trace('showAdvanceInput');

    this.hideComponentInputEvent();

    const filter = new AdvanceFilter;
    filter.idEmployee = this.employee.code;
    filter.referenceMonth = this.referenceMonth

    this.advanceService.findByReferenceMonthAndEmployee(filter)
      .then(result => {
        if (result) {
          this.advanceCode = result.code;
        }
        this.displayAdvanceInput = true;
      })
      .catch(erro => {
        this.trace('erro.status: '+erro.status);
        if (erro.status === 404) {
          this.toasty.warning('Não há adiantamento lançado para este colaborador ');
          this.displayAdvanceInput = true;
        } else {
          this.handler.handleError(erro);
        }
      });
  }
  
  showPlpt2Input(code: number) {
    this.trace('showPlpt2Input');

    this.hideComponentInputEvent();

    const filter = new Plpt2Filter;
    filter.idEmployee = this.employee.code;
    filter.referenceMonth = this.referenceMonth

    this.plpt2Service.findByReferenceMonthAndEmployee(filter)
      .then(result => {
        if (result) {
          this.plpt2Code = result.code;
        }
        this.displayPlpt2Input = true;
      })
      .catch(erro => {
        if (erro.status === 404) {
          this.toasty.warning('Não há lpt2 lançado para este colaborador ');
          this.displayPlpt2Input = true;
        } else {
          this.handler.handleError(erro);
        }
      });
  }

  showVacationInput(code: number) {
    this.trace('showVacationInput');

    this.hideComponentInputEvent();

    const filter = new VacationFilter;
    filter.idEmployee = this.employee.code;
    filter.referenceMonth = this.referenceMonth

    this.vacationService.findByReferenceMonthAndEmployee(filter)
      .then(result => {
        if (result) {
          this.vacationCode = result.code;
        }
        this.displayVacationInput = true;
      })
      .catch(erro => {
        if (erro.status === 404) {
          this.toasty.warning('Não há férias lançada para este colaborador ');
          this.displayVacationInput = true;
        } else {
          this.handler.handleError(erro);
        }
      });
  }

  addedEmployeeEvent(employee: Employee) {
    this.trace('addedEmployeeEvent');
    this.employee = employee;
  }

  addedAdvanceEvent() {
    this.trace('addedAdvanceEvent');
  }

  addedVacationvent() {
    this.trace('addedVacationvent');
  }

  addePlpt2Event() {
    this.trace('addePlpt2Event');
  }

  hideComponentInputEvent() {
    this.trace('hideComponentInputEvent');
    this.advanceCode = null;
    this.employeeCode = null;
    this.vacationCode = null;
    this.plpt2Code = null;
    this.displayAdvanceInput = false;
    this.displayEmployeeInput = false;
    this.displayVacationInput = false;
    this.displayPlpt2Input = false;
  }

  // Exibe a janela de input
  showDialogInput(payroll: Payroll) {
    this.trace('showDialogInput');
    this.resetForm();

    // veio do update
    if (payroll) {
      //a folha ja existe
      if (payroll.code) {
        this.payrollService.findByCode(payroll.code)
          .then(result => {
            this.employee = result.employee;
            this.referenceMonth = result.referenceMonth;
            this.formPayroll.patchValue(result);
            this.displayInput = true;
          }).catch(erro => { this.handler.handleError(erro); });
      } else {
        this.employee = payroll.employee;
        this.formPayroll.patchValue(payroll);
        this.displayInput = true;
      }
    }


    this.saved = false;
  }

  // Oculta o dialog de input da ordem
  hidenDialogInput() {
    this.trace('hidenDialogInput');

    if (this.saved || this.isPayrollClosed) {
      this.displayInput = false;
      return;
    }

    this.confirmation.confirm({
      message: 'Deseja fechar a janela sem salvar?',
      accept: () => {
        this.displayInput = false;
      }
    });
  }

  // Realiza o input do registro na API
  savePayroll() {
    this.trace('savePayroll');
    if (this.editing) {
      this.editPayroll();
    } else {
      this.addPayroll();
    }
    this.saved = true;
  }

  totalProventos(payroll: Payroll) {
    return Number(
      (
        payroll.vacationPeriod +
        payroll.vacationDifference +
        payroll.complement13 +
        payroll.maternityPay +
        payroll.fixedSalary +
        payroll.commission +
        payroll.dsr +
        payroll.prize +
        payroll.quebraCaixa +
        payroll.bonus +
        payroll.extraHour +
        payroll.holidayWorked +
        payroll.garantia +
        payroll.familySalary)
    );
  }

  totalDiscount(payroll: Payroll) {
    return Number(
      (
        payroll.vacationPaid +
        payroll.advanceSalary +
        payroll.absences +
        payroll.drugstore +
        payroll.medicalAgreement +
        payroll.syndicateContribution +
        payroll.transportVaucher +
        payroll.inss +
        payroll.inssVacation +
        payroll.irrf
      )
    );
  }

  totalReceive(payroll: Payroll) {
    return Number(
      (payroll.amountToPay)
    );
  }

  onChangeManualInput() {
    this.trace('onChangeManualInput');
    if (this.formPayroll.get('manualInput').value) {

      this.confirmation.confirm({
        message: 'Esta opção desativa todo cálculo da folha deste colaborador. ' +
          'Todos os campos devem ser preenchidos manualmente. ' +
          'Continuar?',
        reject: () => {
          this.formPayroll.get('manualInput').setValue(false);
        }
      });
    }
  }

  get editing() {
    return Boolean(this.formPayroll.get('code').value);
  }

  private prepareForm() {
    this.trace('prepareForm');
    this.formPayroll = this.formBuilder.group({
      code: [],
      status: [],
      referenceMonth: [],
      employee: [],
      workedDays: [],
      vacationDays: [],
      vacationPeriod: [],
      vacationPeriodWithouThird: [],
      vacationDifference: [],
      complement13: [],
      maternityPay: [],
      fixedSalary: [],
      commission: [],
      dsr: [],
      prize: [],
      quebraCaixa: [],
      bonus: [],
      holidayWorked: [],
      extraHour: [],
      garantia: [],
      familySalary: [],
      vacationPaid: [],
      sizeAbsencesHours: [],
      absences: [],
      advanceSalary: [],
      drugstore: [],
      medicalAgreement: [],
      syndicateContribution: [],
      numTransportVaucher: [],
      transportVaucher: [],
      inss: [],
      inssVacation: [],
      irrf: [],
      fgts: [],
      rounding: [],
      amountToPay: [],
      closed: [],
      manualInput: [],
      partialInput: []
    });
    this.resetForm();
  }

  private resetForm() {
    this.trace('resetForm');
    this.formPayroll.reset();
  }

  private findPayrolls() {
    this.trace('findPayrolls');

    this.payrollService.findPayrolls(this.filter)
      .then(result => {
        this.payrolls = result;
        this.totalRecords = this.payrolls.length;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  private listPayroll() {
    this.trace('listPayroll');

    this.payrollService.list(this.filter)
      .then(result => {
        this.payrolls = result;
        this.totalRecords = this.payrolls.length;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  private addPayroll() {
    this.trace('addPayroll');

    //Adiciona o mes referencia do filtro ao objeto a salvar
    this.formPayroll.get('referenceMonth').setValue(this.filter.referenceMonth);

    this.payrollService.save(this.formPayroll.value)
      .then(payroll => {
        // Retirado porque resolvido no backend
        // const index = this.indexOfPayrool(payroll.employee.code);
        // if (index !== -1) {
        //     this.payrolls.splice(index, 1);
        //     this.payrolls.push(payroll)
        // }
        this.formPayroll.patchValue(payroll);
        this.findPayrolls();
        //this.displayInput = false;
        this.toasty.success('Dados inserido com suesso');
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  private editPayroll() {
    this.trace('editPayroll');

    this.payrollService.edit(this.formPayroll.value)
      .then(payroll => {
        this.findPayrolls();
        this.formPayroll.patchValue(payroll);
        this.toasty.success('Dados alterado com suesso');
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  private indexOfPayrool(codeEmployee: number) : number{
    let i = -1;
    for (const payroll of this.payrolls) {
      i++;
      if (codeEmployee === payroll.employee.code){
        break;
      }
    }
    return i;
  }

  private trace(value: string) {
    console.log('PayrollDetailComponent:' + value);
  }
}

