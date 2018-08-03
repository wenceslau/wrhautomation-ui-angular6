import { Injectable } from '@angular/core';
import { Account } from '../../core/model';
import { CoreService, Parameters } from '../../core/services/core.service';

@Injectable()
export class AccountService {

  private path = '/account';

  constructor(private service: CoreService) { }

  list(): Promise<any> {
    this.trace('list');
    const pars = new Parameters();
    pars.path = this.path;
    return this.service.list(pars);
  }

  save(object: Account): Promise<Account> {
    this.trace('save');
    const pars = new Parameters();
    pars.path = this.path;
    pars.object = object;
    return this.service.save(pars);
  }

  edit(object: Account): Promise<Account> {
    this.trace('edit');
    const pars = new Parameters();
    pars.path = this.path;
    pars.object = object;
    return this.service.edit(pars);
  }

  changePassword(oldp: string, newp: string): Promise<void> {
    this.trace('changePassword');
    return this.service.put(this.path + '/changePassword?oldp=' + oldp + '&newp=' + newp);
  }

  resetPassword(code: number): Promise<void> {
     this.trace('resetPassword: code: ' + code);
      return this.service.put(this.path + '/resetPassword?code=' + code);
    }

  findByCode(code: number): Promise<Account> {
    const pars = new Parameters();
    pars.path = this.path;
    return this.service.findByCode(pars, code);
  }

  private trace(value: string) {
    console.log('AccountService:' + value);
  }

}
