import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import * as moment from 'moment';

import { CoreService, Parameters } from '../../core/services/core.service';
import { BaseFilter, Payment, Bool } from '../../core/model';

export class PaymentFilter extends BaseFilter {
  referenceMonth: Date;
  idEmployee: number;
}

@Injectable()
export class PaymentService {

  private path = '/paymentBill';

  constructor(private service: CoreService) { }

  findAndCalculate(referenceMonth: Date, type: String): Promise<any> {
    const pars = new Parameters();
    pars.path = this.path + '/findAndCalculate?referenceMonth=' +
      moment(referenceMonth).format('YYYY-MM-DD') + '&type=' + type;
    return this.service.list(pars);
  }

  list(referenceMonth: Date, type: string): Promise<any> {
    const pars = new Parameters();
    pars.path = this.path + '?referenceMonth=' + moment(referenceMonth).format('YYYY-MM-DD') + '&type=' + type;
    return this.service.list(pars);
  }

  save(object: Payment): Promise<Payment> {
    const pars = new Parameters();
    pars.path = this.path;
    pars.object = object;
    return this.service.save(pars);
  }

  edit(object: Payment): Promise<Payment> {

    const pars = new Parameters();
    pars.path = this.path;
    pars.object = object;
    return this.service.edit(pars)
      .then(result => {
        this.converterStringsParaDatas([result]);
        return result;
      });
  }

  findByCode(code: number): Promise<Payment> {
    const pars = new Parameters();
    pars.path = this.path;
    return this.service.findByCode(pars, code)
      .then(result => {
        this.converterStringsParaDatas([result]);
        return result;
      });
  }

  delete(code: number): Promise<void> {
    const pars = new Parameters();
    pars.path = this.path;
    return this.service.delete(pars, code)
      .then(() => null);
  }

  generate(referenceMonth: Date, type: String): Promise<Bool> {

    return this.service.post('/paymentBill/generate?referenceMonth='
      + moment(referenceMonth).format('YYYY-MM-DD') + '&type=' + type);

  }

  saveAll(referenceMonth: Date, type: String): Promise<Bool> {
    return this.service.post('/paymentBill/saveAll?referenceMonth='
      + moment(referenceMonth).format('YYYY-MM-DD') + '&type=' + type);

  }

  private converterStringsParaDatas(payments: Payment[]) {
    for (const payment of payments) {
      if (payment.referenceMonth) {
        payment.referenceMonth = moment(payment.referenceMonth,
          'YYYY-MM-DD').toDate();
      }
      if (payment.movimentDate) {
        payment.movimentDate = moment(payment.movimentDate,
          'YYYY-MM-DD').toDate();
      }
      if (payment.dueDate) {
        payment.dueDate = moment(payment.dueDate,
          'YYYY-MM-DD').toDate();
      }
    }
  }

}
