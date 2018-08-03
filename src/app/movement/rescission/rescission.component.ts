import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ToastyService } from 'ng2-toasty';

import { HandlerService } from '../../core/services/handler.service';
import { RescissionService, RescissionFilter } from './../services/rescission.service';
import { CompanyService } from './../../maintenance/services/company.service';
import { EmployeeService, EmployeeFilter } from './../../maintenance/services/employee.service';

import { Rescission, Company, Employee } from './../../core/model';

import * as moment from 'moment';
import { PayrollFilter, PayrollService } from '../services/payroll.service';
import { reject } from 'q';


@Component({
  selector: 'app-rescission',
  templateUrl: './rescission.component.html',
  styleUrls: ['./rescission.component.css']
})
export class RescissionComponent implements OnInit {

  formRescission: FormGroup;

  page = '[ Movimentação / Recisão ] ';

  month: string;
  year: string;

  referenceMonth: Date;
  collapsed: boolean;

  isPayrollClosed: boolean;       // Identifica se a folha corrente esta aberta 
  saved: boolean;               // Usada para emitir msg de fechamento sem salvar
  displayInput: boolean;        // Exibe o dialog de input
  totalRecords: number;         // Numero de registro da lista

  rescissions: Rescission[];
  companies: Company[];
  employees: Employee[];
  company: Company;
  filter: RescissionFilter;


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
    private rescissionService: RescissionService,
    public handler: HandlerService,
    private companyService: CompanyService,
    private employeeService: EmployeeService,
    private payrollService: PayrollService,
    private confirmation: ConfirmationService,
    private toasty: ToastyService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.collapsed = true;
    this.isPayrollClosed = true;
    this.month = this.handler.month;
    this.year = this.handler.year;
    this.filter = new RescissionFilter;
    this.prepareForm();
    this.listCompany();
    this.handler.setInfoMessage('');
    this.handler.setNavigation(this.page);
  }

  // Exibe a janela de input
  showDialogInput(code: number) {
    this.trace('showDialogInput');

    this.resetForm();

    if (code) {
      this.rescissionService.findByCode(code)
        .then(result => {
          this.referenceMonth = result.referenceMonth;
          this.company = result.employee.company;
          this.listEmployee(this.company.code);
          setTimeout(() => {
            this.formRescission.patchValue(result);
            this.displayInput = true;
          }, 30);
        }).catch(erro => { this.handler.handleError(erro); });

    } else {
      this.displayInput = true;
    }

    this.saved = false;
  }

  // Oculta o dialog de input da ordem
  hidenDialogInput() {
    this.trace('hidenDialogInput');

    if (this.saved) {
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

  search() {
    this.trace('search');
    this.checkPayroll()

    this.listRescission();
  }

  // Realiza o input do registro na API
  saveRescission() {
    this.trace('saveRescission');
    
    this.confirmation.confirm({
      message: 'Esta rescisão foi solicitada pelo empregado ou defina pela empresa? ' +
        'Essa informação é importante, reflete no pagamento do FGTS. Escolha SIM para empregado, NÃO para empresa',
      accept: () => {
        this.formRescission.get('solicitada').setValue(true);
        this.executeSave();
      },
      reject: () => {
        this.formRescission.get('solicitada').setValue(false);
        this.executeSave();
      }
    });
  }

  private executeSave(){
    if (this.editing) {
      this.editRescission();
    } else {
      this.addRescission();
    }
    this.saved = true;
  }

  // Preenche os empregados pela empresa
  changeCompany() {
    this.trace('changeCompany');
    this.listEmployee(this.company.code);
  }

  confirmDelete(code: number) {
    this.trace('confirmDelete');

    this.confirmation.confirm({
      message: 'Deseja confirmar a exclusão',
      accept: () => {
        this.deleteRescission(code);
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

  get editing() {
    return Boolean(this.formRescission.get('code').value);
  }

  private prepareForm() {
    this.trace('prepareForm');
    this.formRescission = this.formBuilder.group({
      code: [],
      status: [],
      referenceMonth: [],
      employee: [],
      dataRescisision: [],
      saldoSalario_50: [],
      comissao_51: [],
      gratificacao_52: [],
      adicionalInsalubridade_53: [],
      adicionalPericuliosidade_54: [],
      adicionalNoturno_55: [],
      horasExtras_56: [],
      gorjetas_57: [],
      dsr_58: [],
      dsrSobreSaldoSalario_59: [],
      multaArtigo447_60: [],
      multaArtigo479_61: [],
      salarioFamilia_62: [],
      salarioProporcional_63: [],
      _13SalarioExercicioAnterior_64: [],
      feriasProporcional_65: [],
      feriasVencidas_66: [],
      tercoConstituicional_68: [],
      avisoPrevioIndenizado_69: [],
      _13SalarioAvisoPrevio_70: [],
      feriasAvisoPrevio_71: [],
      diversos_95: [],
      ajusteSaldoDevedor_99: [],
      indenizacaoExperiencia_000: [],
      complementoPiso_000: [],
      totalReceitas: [],
      pensaAlimenticia_100: [],
      adiantamentoSalarial_101: [],
      adiantamento13Salario_102: [],
      avisoPrevioIndenizado_103: [],
      previdenciaSocial_112_1: [],
      previdenciaSocial13Salario_112_2: [],
      irrf_114: [],
      irrf13Salario_114_1: [],
      arredondamentoAnterior_115: [],
      faltas_000: [],
      convenioMedico_000: [],
      valeTransporte_000: [],
      descMedicamento_000: [],
      contSindical_000: [],
      totalDeducoes: [],
      valorLiquido: [],
      fgts: [],
      solicitada: []
    });
    this.resetForm();
  }

  private resetForm() {
    this.trace('resetForm');
    this.formRescission.reset();
    this.formRescission.get('solicitada').setValue(false);
    this.formRescission.get('status').setValue(true);
    this.company = null;
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


  private listCompany() {
    this.trace('listCompany');
    this.companyService.list(true)
      .then(result => {
        this.trace(result);
        this.companies = result;
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  private listEmployee(code: number) {
    this.trace('listEmployee');
    const filter = new EmployeeFilter;
    filter.status = true;
    if (code) {
      filter.idCompany = code;
    }

    this.employeeService.list(filter)
      .then(result => {
        this.trace(result);
        this.employees = result;
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  private listRescission() {
    this.trace('listRescission');

    this.filter.referenceMonth = this.getReferenceMonth();
    this.rescissionService.list(this.filter)
      .then(result => {
        this.rescissions = result;
        this.totalRecords = this.rescissions.length;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  private addRescission() {
    this.trace('addRescission');

    //Adiciona o mes referencia do filtro ao objeto a salvar
    this.formRescission.get('referenceMonth').setValue(this.filter.referenceMonth);

    this.rescissionService.save(this.formRescission.value)
      .then(lancamentoAdicionado => {
        this.listRescission();
        this.displayInput = false;
        this.toasty.success('Dados inserido com suesso');
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  private editRescission() {
    this.trace('editRescission');

    this.rescissionService.edit(this.formRescission.value)
      .then(rescission => {
        this.listRescission();
        this.formRescission.patchValue(rescission);
        this.toasty.success('Dados alterado com suesso');
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  private deleteRescission(code: number) {
    this.trace('deleteRescission');
    this.rescissionService.delete(code)
      .then(result => {
        this.listRescission();
        this.toasty.success('Objeto deletado com suesso');
      }).catch(erro => { this.handler.handleError(erro); });
  }

  private trace(value: string) {
    console.log('RescissionComponent:' + value);
  }
}
