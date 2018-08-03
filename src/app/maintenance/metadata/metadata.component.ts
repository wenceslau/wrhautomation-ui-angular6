import { MetadataService } from './../services/metadata.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HandlerService } from '../../core/services/handler.service';
import { ConfirmationService } from 'primeng/api';
import { ToastyService } from 'ng2-toasty';
import { Metadata } from '../../core/model';

@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.css']
})
export class MetadataComponent implements OnInit {

  metadatas: Metadata[];

  saved: boolean;               // Usada para emitir msg de fechamento sem salvar
  totalRecords: number;         // Numero de registro da lista
  displayInput: boolean;        // Exibe o dialog de input
  formMetadata: FormGroup;
  page = '[ Manutenção / Parametros ] ';

  constructor(
    private metadataService: MetadataService,
    public handler: HandlerService,
    private confirmation: ConfirmationService,
    private toasty: ToastyService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.initListMetadata();
    this.prepareForm();
    this.handler.setNavigation(this.page);
    this.handler.setInfoMessage('');
  }

  // Exibe a janela de input
  showDialogInput(code: number) {
    this.trace('showDialogInput');

    this.resetForm();

    if (code) {
      this.metadataService.findByCode(code)
        .then(result => {
          this.formMetadata.patchValue(result);
          this.displayInput = true;
        })
        .catch(erro => { this.handler.handleError(erro); });

    } else {
      this.displayInput = true;
    }

    this.saved = false;
  }

  // Limpar a ultima pesquisa
  initListMetadata() {
    this.trace('initListMetadata');
    this.listMetadata();
  }

  // Realiza o input do registro na API
  saveMetadata() {
    this.trace('saveMetadata');

    if (this.editing) {
      this.editMetadata();
    } else {
      this.addMetadata();
    }
    this.saved = true;
  }

  get editing() {
    return Boolean(this.formMetadata.get('code').value);
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
    this.formMetadata = this.formBuilder.group({
      code: [],
      status: [],
      description: [],
      key: [],
      data1: [],
      data2: [],
      data3: [],
      data4: [],
      data5: [],
      data6: [],
    });
    this.resetForm();
  }

  private resetForm() {
    this.trace('resetForm');
    this.formMetadata.reset();
  }

  private listMetadata() {
    this.trace('listMetadata');
    this.metadataService.list()
      .then(result => {
        this.metadatas = result;
        this.totalRecords = this.metadatas.length;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  // Adiciona o objeto na API
  private addMetadata() {
    this.trace('addMetadata');
    this.metadataService.save(this.formMetadata.value)
      .then(lancamentoAdicionado => {
        this.listMetadata();
        this.displayInput = false;
        this.toasty.success('Fonte de dados inserido com suesso');
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  // Edita o objeto na API
  private editMetadata() {
    this.trace('editMetadata');
    this.metadataService.edit(this.formMetadata.value)
      .then(metadata => {
        this.listMetadata();
        this.formMetadata.patchValue(metadata);
        this.toasty.success('Fonte de dados alterada com suesso');
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  private trace(value: string) {
    console.log('MetadataComponent:' + value);
  }
}
