import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CompanyService } from '../services/company.service';
import { HandlerService } from '../../core/services/handler.service';
import { ConfirmationService } from 'primeng/api';
import { ToastyService } from 'ng2-toasty';
import { Company } from '../../core/model';

import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  companies: Company[];

  saved: boolean; // Usada para emitir msg de fechamento sem salvar
  totalRecords: number;         // Numero de registro da lista
  displayInput: boolean;        // Exibe o dialog de input
  formCompany: FormGroup;
  page = '[ Manutenção / Empresa ] ';

  constructor(
    private companyService: CompanyService,
    public handler: HandlerService,
    private confirmation: ConfirmationService,
    private toasty: ToastyService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.prepareForm();
    this.initListCompany();
    this.handler.setNavigation(this.page);
    this.handler.setInfoMessage('');
  }

  // Exibe a janela de input
  showDialogInput(code: number) {
    this.trace('showDialogInput');
    this.resetForm();

    if (code) {
      this.companyService.findByCode(code)
        .then(result => {
          this.formCompany.patchValue(result);
          this.displayInput = true;
        })
        .catch(erro => { this.handler.handleError(erro); });

    } else {
      this.displayInput = true;
    }

    this.saved = false;
  }

  // Limpar a ultima pesquisa
  initListCompany() {
    this.trace('initListCompany');
    this.listCompany();
  }

  // Realiza o input do registro na API
  saveCompany() {
    this.trace('saveCompany');

    // ativa o campo para o form envia-lo
    this.formCompany.get('imported').enable();

    if (this.editing) {
      this.editCompany();
    } else {
      this.addCompany();
    }
    this.saved = true;
  }

  get editing() {
    return Boolean(this.formCompany.get('code').value);
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

  private prepareForm() {
    this.trace('prepareForm');
    this.formCompany = this.formBuilder.group({
      code: [],
      status: [],
      codGroup: [],
      group: [],
      externalCode: [],
      name: [],
      nameFantasy: [],
      cnpj: [],
      ie: [],
      address: this.formBuilder.group({
        logradouro: [],
        neighborhood: [],
        cep: [],
        city: [],
        stateOfCity: [],
      }),
      phone: [],
      main: [],
      imported: []
    });
    this.resetForm();
  }

  private resetForm() {
    this.trace('resetForm');
    this.formCompany.reset();
    this.formCompany.get('status').setValue(true);
    this.formCompany.get('main').setValue(false);
    this.formCompany.get('imported').disable();
  }

  private listCompany() {
    this.trace('listCompany');
    // this.handler.block();
    this.companyService.list(null)
      .then(result => {
        this.companies = result;
        this.totalRecords = this.companies.length;
        // this.handler.unblock();
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  // Adiciona o objeto na API
  private addCompany() {
    this.trace('addCompany');
    this.formCompany.get('imported').setValue(false);
    this.companyService.save(this.formCompany.value)
      .then(lancamentoAdicionado => {
        this.listCompany();
        this.displayInput = false;
        this.toasty.success('Colaborador inserido com suesso');
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  // Edita o objeto na API
  private editCompany() {
    this.trace('editCompany');
    this.companyService.edit(this.formCompany.value)
      .then(company => {
        this.listCompany();
        this.formCompany.patchValue(company);
        this.toasty.success('Colaborador alterado com suesso');
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  private trace(value: string) {
    console.log('CompanyComponent:' + value);
  }
}
