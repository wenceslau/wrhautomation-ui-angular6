
import { Injectable } from '@angular/core';
import { Metadata } from '../../core/model';
import { CoreService, Parameters } from '../../core/services/core.service';

@Injectable()
export class MetadataService {

  private path = '/metadata';

  constructor(private service: CoreService) { }

  list(): Promise<any> {
    var pars = new Parameters();
    pars.path = this.path;
    return this.service.list(pars);
  }

  save(object: Metadata): Promise<Metadata> {
    var pars = new Parameters();
    pars.path = this.path;
    pars.object = object;
    return this.service.save(pars);
  }

  edit(object: Metadata): Promise<Metadata> {

    var pars = new Parameters();
    pars.path = this.path;
    pars.object = object;
    return this.service.edit(pars);
  }

  findByCode(code: number): Promise<Metadata> {
    var pars = new Parameters();
    pars.path = this.path;
    return this.service.findByCode(pars, code);
  }

}
