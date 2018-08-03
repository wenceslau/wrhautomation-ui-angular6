import { DatasourceService } from './../services/datasource.service';
import { Datasource } from './../../core/model';
import { AccountService } from './../services/account.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HandlerService } from '../../core/services/handler.service';
import { ConfirmationService } from 'primeng/api';
import { ToastyService } from 'ng2-toasty';
import { Account } from '../../core/model';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  accounts: Account[];
  profiles: Datasource[];
  saved: boolean;               // Usada para emitir msg de fechamento sem salvar
  totalRecords: number;         // Numero de registro da lista
  displayInput: boolean;        // Exibe o dialog de input
  formAccount: FormGroup;
  page = '[ Manutenção / Usuário ] ';

  constructor(
    private accountService: AccountService,
    public handler: HandlerService,
    private profileService: ProfileService,
    private confirmation: ConfirmationService,
    private toasty: ToastyService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.listProfile();
    this.initListAccount();
    this.prepareForm();
    this.handler.setNavigation(this.page);
    this.handler.setInfoMessage('');
  }

  // Exibe a janela de input
  showDialogInput(code: number) {
    this.trace('showDialogInput');
    this.resetForm();
    if (code) {
      this.accountService.findByCode(code)
        .then(result => {
          this.formAccount.patchValue(result);
          this.displayInput = true;
        })
        .catch(erro => { this.handler.handleError(erro); });

    } else {
      this.displayInput = true;
    }
    this.saved = false;
  }

  // Exibe a janela de input
  resetPassword(code: number, name: string) {
    this.trace('resetPassword');

    this.confirmation.confirm({
      message: 'Confirma resete de senha do usuário ' + name + '?',
      accept: () => {
        this.accountService.resetPassword(code)
          .then(result => {
            this.displayInput = false;
            this.toasty.success('Senha resetada com sucesso');
          }).catch(erro => { this.handler.handleError(erro); });
      }
    });
  }


  // Limpar a ultima pesquisa
  initListAccount() {
    this.trace('initListAccount');
    this.listAccount();
  }

  // Realiza o input do registro na API
  saveAccount() {
    this.trace('saveAccount');

    if (this.editing) {
      this.editAccount();
    } else {
      this.addAccount();
    }
    this.saved = true;
  }

  get editing() {
    return Boolean(this.formAccount.get('code').value);
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

  private listProfile() {
    this.trace('listProfile');
    this.profileService.list()
      .then(result => {
        this.profiles = result;
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  private prepareForm() {
    this.trace('prepareForm');
    this.formAccount = this.formBuilder.group({
      code: [],
      status: [],
      name: [],
      username: [],
      profile: [],
    });
    this.resetForm();
  }

  private resetForm() {
    this.trace('resetForm');
    this.formAccount.reset();
  }

  private listAccount() {
    this.trace('listAccount');
    this.accountService.list()
      .then(result => {
        this.accounts = result;
        this.totalRecords = this.accounts.length;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  // Adiciona o objeto na API
  private addAccount() {
    this.trace('addAccount');
    this.accountService.save(this.formAccount.value)
      .then(lancamentoAdicionado => {
        this.listAccount();
        this.displayInput = false;
        this.toasty.success('Dados inserido com suesso');
        this.handler.showDialogInfo('A senha inicial dessa conta é @1234');
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  // Edita o objeto na API
  private editAccount() {
    this.trace('editAccount');
    this.accountService.edit(this.formAccount.value)
      .then(account => {
        this.listAccount();
        this.formAccount.patchValue(account);
        this.toasty.success('Dados alterado com suesso');
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  private trace(value: string) {
    console.log('AccountComponent:' + value);
  }
}

