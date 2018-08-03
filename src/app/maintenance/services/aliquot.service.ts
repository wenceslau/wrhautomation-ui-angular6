import { Http, Headers, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';

import { Aliquot } from './../../core/model';
import { BaseFilter } from '../../core/model';
import { CoreService, Parameters } from '../../core/services/core.service';

export class AliquotFilter extends BaseFilter {
  typeAliquot: string;
}


@Injectable()
export class AliquotService {
  private path = '/aliquot';

  constructor(private service: CoreService) { }

  list(filter: AliquotFilter): Promise<any> {

    const search = new URLSearchParams();

    if (filter) {
      if (filter.typeAliquot) {
        search.set('typeAliquot', filter.typeAliquot);
      }
      if (filter.orderBy) {
        search.set('orderBy', filter.orderBy);
      }
    }
    const pars = new Parameters();
    pars.path = this.path;
    pars.search = search;

    return this.service.list(pars);
  }

  save(object: Aliquot): Promise<Aliquot> {
    const pars = new Parameters();
    pars.path = this.path;
    pars.object = object;
    return this.service.save(pars);
  }

  edit(object: Aliquot): Promise<Aliquot> {

    const pars = new Parameters();
    pars.path = this.path;
    pars.object = object;
    return this.service.edit(pars)
      .then(employee => {
        return employee;
      });
  }

  findByCode(code: number): Promise<Aliquot> {
    const pars = new Parameters();
    pars.path = this.path;
    return this.service.findByCode(pars, code)
      .then(employee => {
        return employee;
      });
  }

  private trace(value: string) {
    console.log('AliquotService:' + value);
  }
}
