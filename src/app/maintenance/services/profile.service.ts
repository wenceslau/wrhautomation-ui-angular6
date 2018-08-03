import { Injectable } from '@angular/core';
import { CoreService, Parameters } from '../../core/services/core.service';
import { Profile } from '../../core/model';

@Injectable()
export class ProfileService {
  private path = '/profile';

  constructor(private service: CoreService) { }

  listPermission(): Promise<any> {
    const pars = new Parameters();
    pars.path = '/permission';
    return this.service.list(pars);
  }

  list(): Promise<any> {
    const pars = new Parameters();
    pars.path = this.path;
    return this.service.list(pars);
  }

  save(object: Profile): Promise<Profile> {
    const pars = new Parameters();
    pars.path = this.path;
    pars.object = object;
    return this.service.save(pars);
  }

  edit(object: Profile): Promise<Profile> {
    const pars = new Parameters();
    pars.path = this.path;
    pars.object = object;
    return this.service.edit(pars);
  }

  findByCode(code: number): Promise<Profile> {
    const pars = new Parameters();
    pars.path = this.path;
    return this.service.findByCode(pars, code);
  }
}
