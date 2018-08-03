import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import * as moment from 'moment';

import { CoreService, Parameters } from '../../core/services/core.service';
import { Payroll, BaseFilter, Bool } from '../../core/model';

export class PayrollFilter extends BaseFilter {
  referenceMonth: Date;
  idCompany: number;
}

@Injectable()
export class PayrollService {

  private path = '/payroll';

  constructor(private service: CoreService) { }

  findPayrolls(filter: PayrollFilter): Promise<any> {
    const search = new URLSearchParams();

    if (filter) {
      if (filter.referenceMonth) {
        search.set('referenceMonth', moment(filter.referenceMonth).format('YYYY-MM-DD'));
      }
      if (filter.idCompany) {
        search.set('idCompany', filter.idCompany.toString());
      }
    }

    const pars = new Parameters();
    pars.path = this.path;
    pars.search = search
    return this.service.list(pars);
  }

  list(filter: PayrollFilter): Promise<any> {
    const search = new URLSearchParams();

    if (filter) {
      if (filter.referenceMonth) {
        search.set('referenceMonth', moment(filter.referenceMonth).format('YYYY-MM-DD'));
      }
      if (filter.idCompany) {
        search.set('idCompany', filter.idCompany.toString());
      }
    }

    const pars = new Parameters();
    pars.path = this.path + '/list';
    pars.search = search
    return this.service.list(pars);
  }


  save(object: Payroll): Promise<Payroll> {
    const pars = new Parameters();
    pars.path = this.path;
    pars.object = object;
    return this.service.save(pars);
  }

  edit(object: Payroll): Promise<Payroll> {

    const pars = new Parameters();
    pars.path = this.path;
    pars.object = object;
    return this.service.edit(pars)
      .then(result => {
        this.converterStringsParaDatas([result]);
        return result;
      });
  }

  findByCode(code: number): Promise<Payroll> {
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


  closed(referenceMonth: Date): Promise<Bool> {

    return this.service.get('/payroll/closed?referenceMonth='
      + moment(referenceMonth).format('YYYY-MM-DD'));

  }

  close(referenceMonth: Date): Promise<Bool> {

    return this.service.post('/payroll/close?referenceMonth='
      + moment(referenceMonth).format('YYYY-MM-DD'));

  }

  closedPrevious(referenceMonth: Date): Promise<Bool> {

    return this.service.get('/payroll/closed/previous?referenceMonth='
      + moment(referenceMonth).format('YYYY-MM-DD'));

  }

  after(referenceMonth: Date): Promise<Bool> {

    return this.service.get('/payroll/after?referenceMonth='
      + moment(referenceMonth).format('YYYY-MM-DD'));

  }



  private converterStringsParaDatas(payrolls: Payroll[]) {
    for (const payroll of payrolls) {
      if (payroll.referenceMonth) {
        payroll.referenceMonth = moment(payroll.referenceMonth,
          'YYYY-MM-DD').toDate();
      }
    }
  }

}
