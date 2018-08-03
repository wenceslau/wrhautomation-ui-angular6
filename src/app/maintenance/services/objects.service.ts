import { CoreService } from './../../core/services/core.service';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class ObjectsService {

  constructor(private http: Http, private service: CoreService) { }

  // Metodo list da api, retora lista de vendedores da empresa em parametro
  listSalesman(idCompany: string): Promise<any> {
    return this.service.get('/object/salesman/' + idCompany);
  }

  // Metodo list da api, retora lista do fornecedor com like pelo nome
  listSupplier(name: string, nickname: string): Promise<any> {
    return this.service.get('/object/supplier/?name=' + name + '&nickname=' + nickname);
  }
}
