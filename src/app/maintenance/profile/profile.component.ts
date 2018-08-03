import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HandlerService } from '../../core/services/handler.service';
import { ConfirmationService } from 'primeng/api';
import { ToastyService } from 'ng2-toasty';
import { Profile, Permission } from '../../core/model';
import { Datasource } from './../../core/model';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profiles: Profile[];
  permissions: Permission[];
  saved: boolean;               // Usada para emitir msg de fechamento sem salvar
  totalRecords: number;         // Numero de registro da lista
  displayInput: boolean;        // Exibe o dialog de input
  formProfile: FormGroup;
  page = '[ Manutenção / Perfil ] ';

  constructor(
    private profileService: ProfileService,
    public handler: HandlerService,
    private confirmation: ConfirmationService,
    private toasty: ToastyService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.listPermission();
    this.initListProfile();
    this.prepareForm();
    this.handler.setNavigation(this.page);
    this.handler.setInfoMessage('');
  }

  // Exibe a janela de input
  showDialogInput(code: number) {

    this.trace('showDialogInput');

    this.resetForm();

    if (code) {
      this.profileService.findByCode(code)
        .then(result => {
          this.formProfile.patchValue(result);
          this.displayInput = true;
        })
        .catch(erro => { this.handler.handleError(erro); });

    } else {
      this.displayInput = true;
    }

    this.saved = false;
  }

  // Limpar a ultima pesquisa
  initListProfile() {
    this.trace('initListProfile');
    this.listProfile();
  }

  // Realiza o input do registro na API
  saveProfile() {
    this.trace('saveProfile');

    if (this.editing) {
      this.editProfile();
    } else {
      this.addProfile();
    }
    this.saved = true;
  }

  get editing() {
    return Boolean(this.formProfile.get('code').value);
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

  private listPermission() {
    this.trace('listPermission');
    this.profileService.listPermission()
      .then(result => {
        this.permissions = result;
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  private prepareForm() {
    this.trace('prepareForm');
    this.formProfile = this.formBuilder.group({
      code: [],
      name: [],
      permissions: [],
    });
    this.resetForm();
  }

  private resetForm() {
    this.trace('resetForm');
    this.formProfile.reset();
  }

  private listProfile() {
    this.trace('listProfile');
    this.profileService.list()
      .then(result => {
        this.profiles = result;
        this.totalRecords = this.profiles.length;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  // Adiciona o objeto na API
  private addProfile() {
    this.trace('addProfile');
    this.profileService.save(this.formProfile.value)
      .then(lancamentoAdicionado => {
        this.listProfile();
        this.displayInput = false;
        this.toasty.success('Perfil inserido com suesso');
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  // Edita o objeto na API
  private editProfile() {
    this.trace('editProfile');
    this.profileService.edit(this.formProfile.value)
      .then(profile => {
        this.listProfile();
        this.formProfile.patchValue(profile);
        this.toasty.success('Perfil alterado com suesso');
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  private trace(value: string) {
    console.log('ProfileComponent:' + value);
  }
}
