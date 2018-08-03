import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import * as moment from 'moment';

import { CoreService, Parameters } from '../../core/services/core.service';
import { Advance, BaseFilter } from '../../core/model';


export class AdvanceFilter extends BaseFilter {
  referenceMonth: Date;
  idEmployee: number;
}

@Injectable()
export class AdvanceService {

  private path = '/advance';

  constructor(private service: CoreService) { }

  list(filter: AdvanceFilter): Promise<any> {
    const search = new URLSearchParams();

    if (filter) {
      if (filter.referenceMonth) {
        search.set('referenceMonth', moment(filter.referenceMonth).format('YYYY-MM-DD'));
      }
    }

    const pars = new Parameters();
    pars.path = this.path;
    pars.search = search;
    return this.service.list(pars);
  }

  findByReferenceMonthAndEmployee(filter: AdvanceFilter): Promise<Advance> {
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

  save(object: Advance): Promise<Advance> {
    const pars = new Parameters();
    pars.path = this.path;
    pars.object = object;
    return this.service.save(pars);
  }

  edit(object: Advance): Promise<Advance> {

    const pars = new Parameters();
    pars.path = this.path;
    pars.object = object;
    return this.service.edit(pars);
  }

  findByCode(code: number): Promise<Advance> {
    const pars = new Parameters();
    pars.path = this.path;
    return this.service.findByCode(pars, code);
  }


  delete(code: number): Promise<void> {
    const pars = new Parameters();
    pars.path = this.path;
    return this.service.delete(pars, code)
      .then(() => null);
  }


}
