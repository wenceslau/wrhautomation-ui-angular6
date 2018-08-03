import { DatasourceService } from './../services/datasource.service';
import { Datasource } from './../../core/model';
import { QueryService } from './../services/query.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HandlerService } from '../../core/services/handler.service';
import { ConfirmationService } from 'primeng/api';
import { ToastyService } from 'ng2-toasty';
import { Query } from '../../core/model';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent implements OnInit {

  querys: Query[];
  datasources: Datasource[];
  saved: boolean;               // Usada para emitir msg de fechamento sem salvar
  totalRecords: number;         // Numero de registro da lista
  displayInput: boolean;        // Exibe o dialog de input
  formQuery: FormGroup;
  page = '[ Manutenção / Consulta SQL ] ';

  constructor(
    private queryService: QueryService,
    public handler: HandlerService,
    private datasourceService: DatasourceService,
    private confirmation: ConfirmationService,
    private toasty: ToastyService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.listDatasource();
    this.initListQuery();
    this.prepareForm();
    this.handler.setNavigation(this.page);
    this.handler.setInfoMessage('');
  }

  // Exibe a janela de input
  showDialogInput(code: number) {

    this.trace('showDialogInput');

    this.resetForm();


    if (code) {
      this.queryService.findByCode(code)
        .then(result => {
          this.formQuery.patchValue(result);
          this.displayInput = true;
        })
        .catch(erro => { this.handler.handleError(erro); });

    } else {
      this.displayInput = true;
    }

    this.saved = false;
  }

  // Limpar a ultima pesquisa
  initListQuery() {
    this.trace('initListQuery');
    this.listQuery();
  }

  // Realiza o input do registro na API
  saveQuery() {
    this.trace('saveQuery');

    if (this.editing) {
      this.editQuery();
    } else {
      this.addQuery();
    }
    this.saved = true;
  }

  get editing() {
    return Boolean(this.formQuery.get('code').value);
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

  private listDatasource() {
    this.trace('listAccountSales');
    this.datasourceService.list()
      .then(result => {
        this.trace(result);
        this.datasources = result;
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  private prepareForm() {
    this.trace('prepareForm');
    this.formQuery = this.formBuilder.group({
      code: [],
      status: [],
      name: [],
      identifier: [],
      query: [],
      datasource: [],
    });
    this.resetForm();
  }

  private resetForm() {
    this.trace('resetForm');
    this.formQuery.reset();
  }

  private listQuery() {
    this.trace('listQuery');
    this.queryService.list()
      .then(result => {
        this.querys = result;
        this.totalRecords = this.querys.length;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  // Adiciona o objeto na API
  private addQuery() {
    this.trace('addQuery');
    this.queryService.save(this.formQuery.value)
      .then(lancamentoAdicionado => {
        this.listQuery();
        this.displayInput = false;
        this.toasty.success('Fonte de dados inserido com suesso');
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  // Edita o objeto na API
  private editQuery() {
    this.trace('editQuery');
    this.queryService.edit(this.formQuery.value)
      .then(query => {
        this.listQuery();
        this.formQuery.patchValue(query);
        this.toasty.success('Fonte de dados alterada com suesso');
      })
      .catch(erro => { this.handler.handleError(erro); });
  }
  private trace(value: string) {
    console.log('QueryComponent:' + value);
  }
}
