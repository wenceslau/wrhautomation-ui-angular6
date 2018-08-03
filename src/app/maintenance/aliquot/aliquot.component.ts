import { AliquotFilter } from './../services/aliquot.service';
import { Aliquot } from './../../core/model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AliquotService } from '../services/aliquot.service';
import { HandlerService } from '../../core/services/handler.service';
import { ConfirmationService } from 'primeng/api';
import { ToastyService } from 'ng2-toasty';

@Component({
  selector: 'app-aliquot',
  templateUrl: './aliquot.component.html',
  styleUrls: ['./aliquot.component.css']
})
export class AliquotComponent implements OnInit {

  filter: AliquotFilter;
  aliquots: Aliquot[];
  saved: boolean;               // Usada para emitir msg de fechamento sem salvar
  totalRecords: number;         // Numero de registro da lista
  displayInputIrrf: boolean;        // Exibe o dialog de input
  displayInputInss: boolean;        // Exibe o dialog de input
  displayInputSalFam: boolean;        // Exibe o dialog de input
  displayInputValTran: boolean;        // Exibe o dialog de input
  formAliquot: FormGroup;
  page: string;
  index: number;
  valDeduc: number;
  typeAliquot: string;
  labelAliquot: string;

  constructor(
    private aliquotService: AliquotService,
    public handler: HandlerService,
    private confirmation: ConfirmationService,
    private toasty: ToastyService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.totalRecords = 0;
    this.labelAliquot = '';
    this.page = '[ Manutenção / Aliquota] ';
    this.initListAliquot();
    this.prepareForm();
    this.handler.setNavigation(this.page);
    this.handler.setInfoMessage('');
    }

  // Exibe a janela de input
  showDialogInput(code: number) {
    this.trace('showDialogInput');

    this.resetForm();
    if (code) {
      this.aliquotService.findByCode(code)
        .then(result => {
          this.formAliquot.patchValue(result);
          this.openDialog();
        })
        .catch(erro => { this.handler.handleError(erro); });

    } else {
      this.openDialog();
    }
    this.saved = false;
  }

  // Oculta o dialog de input da ordem
  hidenDialogInput() {
    this.trace('hidenDialogInput');

    if (this.saved) {
      this.closeDialog();
      return;
    }

    this.confirmation.confirm({
      message: 'Deseja fechar a janela sem salvar?',
      accept: () => {
        this.closeDialog();
      }
    });
  }

  onTabOpen(event) {
    this.index = event.index;

    if (this.index === 0) {
      this.typeAliquot = 'IRRF';
      this.labelAliquot = this.typeAliquot;
    } else if (this.index === 1) {
      this.typeAliquot = 'INSS';
      this.labelAliquot = this.typeAliquot;
    } else if (this.index === 2) {
      this.typeAliquot = 'SALARIO_FAMILIA';
      this.labelAliquot = 'Salario Familia';
    } else if (this.index === 3) {
      this.typeAliquot = 'VALE_TRANSPORTE';
      this.labelAliquot = 'Vale Transporte';
    }

    this.listAliquot();
  }

  // Limpar a ultima pesquisa
  initListAliquot() {
    this.trace('initListAliquot');
    this.listAliquot();
  }

  // Realiza o input do registro na API
  saveAliquot() {
    this.trace('saveAliquot');

    if (this.editing) {
      this.editAliquot();
    } else {
      this.addAliquot();
    }
    this.saved = true;
  }

  get editing() {
    return Boolean(this.formAliquot.get('code').value);
  }

  private prepareForm() {
    this.trace('prepareForm');
    this.formAliquot = this.formBuilder.group({
      code: [],
      status: [],
      typeAliquot: [],
      initialValue: [],
      finalValue: [],
      percentage: [],
      quota: [],
      deduction: [],
      deductionDependent: [],
    });
    this.resetForm();
  }

  private resetForm() {
    this.trace('resetForm');
    this.formAliquot.reset();
  }

  private listAliquot() {
    this.trace('listAliquot');

    if (this.typeAliquot) {
      const filter = new AliquotFilter;
      filter.typeAliquot = this.typeAliquot;
      filter.orderBy = 'finalValue';

      this.aliquotService.list(filter)
        .then(result => {
          this.aliquots = result;
          this.totalRecords = this.aliquots.length;
          if (this.totalRecords !== 0) {
            this.valDeduc = this.aliquots[0].deductionDependent;
          }
        })
        .catch(erro => {
          this.handler.handleError(erro);
        });
    }
  }

  // Adiciona o objeto na API
  private addAliquot() {
    this.trace('addAliquot');
    this.aliquotService.save(this.formAliquot.value)
      .then(lancamentoAdicionado => {
        this.listAliquot();
        this.closeDialog();
        this.toasty.success('Dados inserido com suesso');
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  // Edita o objeto na API
  private editAliquot() {
    this.trace('editAliquot');
    this.aliquotService.edit(this.formAliquot.value)
      .then(aliquot => {
        this.listAliquot();
        this.formAliquot.patchValue(aliquot);
        this.toasty.success('Dados alterado com suesso');
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  public openDialog() {
    this.trace('openDialog');
    this.formAliquot.get('typeAliquot').setValue(this.typeAliquot);
    if (this.index === 0) {
      this.displayInputIrrf = true;
      this.formAliquot.get('quota').setValue(0);
    } else if (this.index === 1) {
      this.displayInputInss = true;
      this.formAliquot.get('quota').setValue(0);
      this.formAliquot.get('deduction').setValue(0);
    } else if (this.index === 2) {
      this.displayInputSalFam = true;
      this.formAliquot.get('deduction').setValue(0);
      this.formAliquot.get('percentage').setValue(0);
      this.formAliquot.get('deductionDependent').setValue(0);
    } else if (this.index === 3) {
        this.displayInputValTran = true;
        this.formAliquot.get('initialValue').setValue(0);
        this.formAliquot.get('finalValue').setValue(0);
        this.formAliquot.get('deduction').setValue(0);
        this.formAliquot.get('deductionDependent').setValue(0);
    }
  }

  private closeDialog() {
    this.trace('closeDialog');
    this.displayInputIrrf = false;
    this.displayInputInss = false;
    this.displayInputSalFam = false;
    this.displayInputValTran = false;
  }

  private trace(value: string) {
    console.log('AliquotComponent:' + value);
  }
}
