
import { Injectable } from '@angular/core';
import { Query } from '../../core/model';
import { CoreService, Parameters } from '../../core/services/core.service';

@Injectable()
export class QueryService {

  private path = '/query';

  constructor(private service: CoreService) { }

  list(): Promise<any> {
    const pars = new Parameters();
    pars.path = this.path;
    return this.service.list(pars);
  }

  save(object: Query): Promise<Query> {
    const pars = new Parameters();
    pars.path = this.path;
    pars.object = object;
    return this.service.save(pars);
  }

  edit(object: Query): Promise<Query> {
    const pars = new Parameters();
    pars.path = this.path;
    pars.object = object;
    return this.service.edit(pars);
  }

  findByCode(code: number): Promise<Query> {
    const pars = new Parameters();
    pars.path = this.path;
    return this.service.findByCode(pars, code);
  }

}
