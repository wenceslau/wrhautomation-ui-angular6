import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import * as moment from 'moment';

import { CoreService, Parameters } from '../../core/services/core.service';
import { Rescission, BaseFilter } from '../../core/model';

export class RescissionFilter extends BaseFilter {
  referenceMonth: Date;
  idEmployee: number;
}

@Injectable()
export class RescissionService {

  private path = '/rescission';

  constructor(private service: CoreService) { }

  list(filter: RescissionFilter): Promise<any> {
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

  save(object: Rescission): Promise<Rescission> {
    const pars = new Parameters();
    pars.path = this.path;
    pars.object = object;
    return this.service.save(pars);
  }

  edit(object: Rescission): Promise<Rescission> {

    const pars = new Parameters();
    pars.path = this.path;
    pars.object = object;
    return this.service.edit(pars)
    .then(result => {
      this.converterStringsParaDatas([result]);
      return result;
    });
  }

  findByCode(code: number): Promise<Rescission> {
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

  private converterStringsParaDatas(rescissions: Rescission[]) {
    for (const rescission of rescissions) {
      if (rescission.dataRescisision) {
        rescission.dataRescisision = moment(rescission.dataRescisision,
          'YYYY-MM-DD').toDate();
      }
      if (rescission.referenceMonth) {
        rescission.referenceMonth = moment(rescission.referenceMonth,
          'YYYY-MM-DD').toDate();
      }
    }
  }

}
