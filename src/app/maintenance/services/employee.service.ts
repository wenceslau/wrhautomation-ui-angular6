import { Http, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import * as moment from 'moment';
import { Employee, BaseFilter } from './../../core/model';
import { Parameters, CoreService } from '../../core/services/core.service';

export class EmployeeFilter extends BaseFilter {
  code: number;
  cpf: string;
  rg: string;
  name: string;
  nickname: string;
  dateOfBirth: Date;
  phone: string;
  mobilePhone: string;
  email: string;
  idCompany: number;
  nameCompany: string;
  position: string;
  dateOfHiringFrom: Date;
  dateOfHiringTo: Date;
  situation: string; // Ativo, Inativo, Licença Maternidade, Afastado
  salary: string;
  kindPayment: string;
  fixedSalaryFrom: number;
  fixedSalaryTo: number;
  transportVoucher: boolean;
}

@Injectable()
export class EmployeeService {

  private path = '/employee';

  constructor(private service: CoreService) { }

  list(filter: EmployeeFilter): Promise<any> {

    const serach = new URLSearchParams();

    if (filter) {

      if (filter.dateOfHiringFrom) {
        serach.set('dateOfHiringFrom', moment(filter.dateOfHiringFrom).format('YYYY-MM-DD'));
      }
      if (filter.dateOfHiringTo) {
        serach.set('dateOfHiringTo', moment(filter.dateOfHiringTo).format('YYYY-MM-DD'));
      }
      if (filter.cpf) {
        serach.set('cpf', filter.cpf);
      }
      if (filter.name) {
        serach.set('name', filter.name);
      }
      if (filter.idCompany) {
        serach.set('idCompany', filter.idCompany.toString());
      }
      if (filter.situation) {
        serach.set('situation', filter.situation);
      }
      if (filter.status) {
        serach.set('status', filter.status+'');
      }
    }

    const pars = new Parameters();
    pars.path = this.path;
    pars.search = serach;

    return this.service.list(pars);
  }

  save(object: Employee): Promise<Employee> {
    const pars = new Parameters();
    pars.path = this.path;
    pars.object = object;
    return this.service.save(pars);
  }

  edit(object: Employee): Promise<Employee> {

    const pars = new Parameters();
    pars.path = this.path;
    pars.object = object;
    return this.service.edit(pars)
      .then(employee => {
        this.converterStringsParaDatas([employee]);
        return employee;
      });
  }

  findByCode(code: number): Promise<Employee> {
    const pars = new Parameters();
    pars.path = this.path;
    return this.service.findByCode(pars, code)
      .then(employee => {
        
        this.converterStringsParaDatas([employee]);
        return employee;
      });
  }

  private converterStringsParaDatas(employees: Employee[]) {
    for (const employee of employees) {
      if (employee.dateOfHiring) {
        employee.dateOfHiring = moment(employee.dateOfHiring,
          'YYYY-MM-DD').toDate();
      }

      if (employee.person.dateOfBirth) {
        employee.person.dateOfBirth = moment(employee.person.dateOfBirth,
          'YYYY-MM-DD').toDate();
      }
    }
  }
}
