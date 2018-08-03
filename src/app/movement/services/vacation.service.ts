import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import * as moment from 'moment';

import { CoreService, Parameters } from '../../core/services/core.service';
import { Vacation, BaseFilter } from '../../core/model';

export class VacationFilter extends BaseFilter {
  referenceMonth: Date;
  idEmployee: number;
}

@Injectable()
export class VacationService {

  private path = '/vacation';

  constructor(private service: CoreService) { }

  list(filter: VacationFilter): Promise<any> {
    const search = new URLSearchParams();

    if (filter) {
      if (filter.referenceMonth) {
        search.set('referenceMonth', moment(filter.referenceMonth).format('YYYY-MM-DD'));
      }
      if (filter.idEmployee) {
        search.set('idEmployee', filter.idEmployee.toString());
      }
    }

    const pars = new Parameters();
    pars.path = this.path;
    pars.search = search
    return this.service.list(pars);
  }

  save(object: Vacation): Promise<Vacation> {
    const pars = new Parameters();
    pars.path = this.path;
    pars.object = object;
    return this.service.save(pars);
  }

  edit(object: Vacation): Promise<Vacation> {

    const pars = new Parameters();
    pars.path = this.path;
    pars.object = object;
    return this.service.edit(pars)
      .then(result => {
        this.converterStringsParaDatas([result]);
        return result;
      });
  }

  findByCode(code: number): Promise<Vacation> {
    const pars = new Parameters();
    pars.path = this.path;
    return this.service.findByCode(pars, code)
      .then(result => {
        this.converterStringsParaDatas([result]);
        return result;
      });
  }

  findByReferenceMonthAndEmployee(filter: VacationFilter): Promise<Vacation> {
    const search = new URLSearchParams();

    if (filter) {
      if (filter.referenceMonth) {
        search.set('referenceMonth', moment(filter.referenceMonth).format('YYYY-MM-DD'));
      }
      if (filter.idEmployee) {
        search.set('idEmployee', filter.idEmployee.toString());
      }
    }

    const pars = new Parameters();
    pars.path = this.path + '/findByReferenceMonthAndEmployee';
    pars.search = search;
    return this.service.list(pars);
  }


  delete(code: number): Promise<void> {
    const pars = new Parameters();
    pars.path = this.path;
    return this.service.delete(pars, code)
      .then(() => null);
  }

  private converterStringsParaDatas(vacations: Vacation[]) {
    for (const vacation of vacations) {
      if (vacation.initialReference) {
        vacation.initialReference = moment(vacation.initialReference,
          'YYYY-MM-DD').toDate();
      }
      if (vacation.finalReference) {
        vacation.finalReference = moment(vacation.finalReference,
          'YYYY-MM-DD').toDate();
      }
      if (vacation.initialEnjoy) {
        vacation.initialEnjoy = moment(vacation.initialEnjoy,
          'YYYY-MM-DD').toDate();
      }
      if (vacation.finalEnjoy) {
        vacation.finalEnjoy = moment(vacation.finalEnjoy,
          'YYYY-MM-DD').toDate();
      }
    }
  }

}
