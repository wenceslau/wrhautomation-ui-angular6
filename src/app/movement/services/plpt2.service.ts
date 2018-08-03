import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import * as moment from 'moment';

import { CoreService, Parameters } from '../../core/services/core.service';
import { Plpt2, BaseFilter } from '../../core/model';

export class Plpt2Filter extends BaseFilter {
  referenceMonth: Date;
  idEmployee: number;
}

@Injectable()
export class Plpt2Service {

  private path = '/plpt2';

  constructor(private service: CoreService) { }

  list(filter: Plpt2Filter): Promise<any> {
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

  save(object: Plpt2): Promise<Plpt2> {
    const pars = new Parameters();
    pars.path = this.path;
    pars.object = object;
    return this.service.save(pars);
  }

  edit(object: Plpt2): Promise<Plpt2> {

    const pars = new Parameters();
    pars.path = this.path;
    pars.object = object;
    return this.service.edit(pars);
  }

  findByCode(code: number): Promise<Plpt2> {
    const pars = new Parameters();
    pars.path = this.path;
    return this.service.findByCode(pars, code);
  }

  findByReferenceMonthAndEmployee(filter: Plpt2Filter): Promise<Plpt2> {
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

}
