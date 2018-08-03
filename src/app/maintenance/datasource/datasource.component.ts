import { DatasourceService } from './../services/datasource.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HandlerService } from '../../core/services/handler.service';
import { ConfirmationService } from 'primeng/api';
import { ToastyService } from 'ng2-toasty';
import { Datasource } from '../../core/model';

@Component({
  selector: 'app-datasource',
  templateUrl: './datasource.component.html',
  styleUrls: ['./datasource.component.css']
})
export class DatasourceComponent implements OnInit {

  datasources: Datasource[];

  saved: boolean;               // Usada para emitir msg de fechamento sem salvar
  totalRecords: number;         // Numero de registro da lista
  displayInput: boolean;        // Exibe o dialog de input
  formDatasource: FormGroup;
  page = '[ Manutenção / Fonte de dados ] ';

  providers = [
    { label: 'MYSQL', value: 'MYSQL' },
    { label: 'MSSQL', value: 'MSSQL' },
    { label: 'ORACLE', value: 'ORACLE' },
    { label: 'ODBC', value: 'ODBC' }
  ];

  constructor(
    private datasourceService: DatasourceService,
    public handler: HandlerService,
    private confirmation: ConfirmationService,
    private toasty: ToastyService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.initListDatasource();
    this.prepareForm();
    this.handler.setNavigation(this.page);
    this.handler.setInfoMessage('');
  }

  // Exibe a janela de input
  showDialogInput(code: number) {

    this.trace('showDialogInput');

    this.resetForm();

    if (code) {
      this.datasourceService.findByCode(code)
        .then(result => {
          this.formDatasource.patchValue(result);
          this.displayInput = true;
        })
        .catch(erro => { this.handler.handleError(erro); });

    } else {
      this.displayInput = true;
    }

    this.saved = false;
  }

  // Limpar a ultima pesquisa
  initListDatasource() {
    this.trace('initListDatasource');
    this.listDatasource();
  }

  // Realiza o input do registro na API
  saveDatasource() {
    this.trace('saveDatasource');

    if (this.editing) {
      this.editDatasource();
    } else {
      this.addDatasource();
    }
    this.saved = true;
  }

  get editing() {
    return Boolean(this.formDatasource.get('code').value);
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
    this.formDatasource = this.formBuilder.group({
      code: [],
      status: [],
      description: [],
      provider: [],
      name: [],
      host: [],
      port: [],
      instance: [],
      nameDataBase: [],
      userDataBase: [],
      passwordDataBase: [],
      integration: []
    });
    this.resetForm();
  }

  private resetForm() {
    this.trace('resetForm');
    this.formDatasource.reset();
    this.formDatasource.get('status').setValue(true);
    this.formDatasource.get('integration').setValue(false);
  }

  private listDatasource() {
    this.trace('listDatasource');
    this.datasourceService.list()
      .then(result => {
        this.datasources = result;
        this.totalRecords = this.datasources.length;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  // Adiciona o objeto na API
  private addDatasource() {
    this.trace('addDatasource');
    this.datasourceService.save(this.formDatasource.value)
      .then(lancamentoAdicionado => {
        this.listDatasource();
        this.displayInput = false;
        this.toasty.success('Fonte de dados inserido com suesso');
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  // Edita o objeto na API
  private editDatasource() {
    this.trace('editDatasource');
    this.datasourceService.edit(this.formDatasource.value)
      .then(datasource => {
        this.listDatasource();
        this.formDatasource.patchValue(datasource);
        this.toasty.success('Fonte de dados alterada com suesso');
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  
  private trace(value: string) {
    console.log('DatasourceComponent:' + value);
  }
}
