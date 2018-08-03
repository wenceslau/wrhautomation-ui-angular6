import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ToastyService } from 'ng2-toasty';

import * as moment from 'moment';
import { Payment, PaymentDetailed } from '../../../core/model';
import { PaymentService, PaymentFilter } from '../../services/payment.service';
import { HandlerService } from '../../../core/services/handler.service';
import { PayrollService } from '../../services/payroll.service';

@Component({
  selector: 'app-payment-salary',
  templateUrl: './payment-salary.component.html',
  styleUrls: ['./payment-salary.component.css']
})
export class PaymentSalaryComponent implements OnInit {

  formPayment: FormGroup;

  @Input() type: string;
  @Input() referenceMonth: Date;
  @Input() isPayrollClosed: boolean;

  page = '[ Movimentação / Contas Pagar ] ';
  displayDetail: boolean;        // Exibe o dialog
  payments: Payment[];

  amountPayment: number;
  amountDetailPayment: number;
  infoMessage: string;
  canSave: boolean;
  canGenerate: boolean;
  payment: Payment;
  paymentDetail: PaymentDetailed[];

  constructor(
    private paymentService: PaymentService,
    public handler: HandlerService,
    private payrollService: PayrollService,
    private confirmation: ConfirmationService,
    private toasty: ToastyService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.trace('Type: ' + this.type)
    this.handler.setNavigation(this.page);
    this.payments = [];
    this.canSave = false;
    this.canGenerate = false;
    this.findAndCalculate();
  }

  showDialogDetail(payment: Payment) {
    this.trace('showDialogDetail');

    this.payment = payment;
    this.paymentDetail = payment.paymentBillDetaileds;
    this.amountDetailPayment = 0;
    for (const detail of this.paymentDetail) {
      this.amountDetailPayment += detail.amount;
    }
    this.displayDetail = true;
  }

  hideDialogDetail() {
    this.trace('hideDialogDetail');

    this.displayDetail = false;
    this.payment = null;
  }

  generate() {
    this.trace('generate');
    this.confirmation.confirm({
      message: 'Deseja gerar o contas a pagar. Esta ação também irá fechar a folha de pagamento',
      accept: () => {
        this.paymentService.generate(this.referenceMonth, this.type)
          .then(result => {
            this.handler.setInfoMessage(result.value);
            this.list();
          })
          .catch(erro => {
            this.handler.handleError(erro);
          });
      }
    });
  }

  saveAll() {
    this.trace('saveAll');
    this.confirmation.confirm({
      message: 'Deseja salvar os registros de pagamento',
      accept: () => {
        this.paymentService.saveAll(this.referenceMonth, this.type)
          .then(result => {
            this.handler.setInfoMessage(result.value);
            this.list();         
          })
          .catch(erro => {
            this.handler.handleError(erro);
          });
      }
    });

  }

  private findAndCalculate() {
    this.trace('findAndCalculate');
    if (this.referenceMonth) {
      this.paymentService.findAndCalculate(this.referenceMonth, this.type)
        .then(result => {
          this.payments = result;
          this.validateStatusPayments();
        })
        .catch(erro => {
          this.handler.handleError(erro);
        });
    }
  }

  private list() {
    this.trace('list');
    if (this.referenceMonth) {
      this.paymentService.list(this.referenceMonth, this.type)
        .then(result => {
          this.payments = result;
          this.validateStatusPayments();
        })
        .catch(erro => {
          this.handler.handleError(erro);
        });
    }
  }

  private validateStatusPayments() {
    this.trace('validateStatusPayments');
    this.canSave = this.payments.length != 0;
    this.amountPayment = 0;
    for (const payment of this.payments) {
      this.amountPayment += payment.amount;
      if (payment.code) {
        if (!payment.landed) {
          this.canGenerate = true;
          this.handler.canPrintPayment = true;
          this.infoMessage = 'O contas a pagar já pode ser gerado';
        } else {
          this.canGenerate = false;
          this.canSave = false;
          this.handler.canPrintPayment = true;
          this.infoMessage = 'O contas a pagar já foi gerado. Qualquer alteração deve ser feito no sistema legado';
        }
      }
    }
  }

  private trace(value: string) {
    console.log('PaymentSalaryComponent:' + value);
  }

}

