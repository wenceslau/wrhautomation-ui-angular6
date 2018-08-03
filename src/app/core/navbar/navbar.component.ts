import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MenuItem } from 'primeng/api';   // Precisa ter o modulo TieredMenuModule importado no core.module

import { AuthorizerService } from './../../security/authorizer.service';
import { HandlerService } from '../services/handler.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  items: MenuItem[];

  constructor(
    private route: Router,
    public handler: HandlerService,
    public auth: AuthorizerService) { }

  ngOnInit() {

    this.items = [
      {
        label: 'Manutenção',
        items: [
          {
            label: 'Empresa',
            routerLink: '/company',
            visible: this.auth.hasPermission('ROLE_COMPANY')
          },
          {
            label: 'Empregado',
            routerLink: '/employee',
            visible: this.auth.hasPermission('ROLE_EMPLOYEE')
          },
          {separator: true},
          {
            label: 'Aliquota',
            routerLink: '/aliquot',
            visible: this.auth.hasPermission('ROLE_ALIQUOT')
          },
          {separator: true},
          {
            label: 'Perfil',
            routerLink: '/profile',
            visible: this.auth.hasPermission('ROLE_PROFILE')
          },
          {
            label: 'Usuário',
            routerLink: '/account',
            visible: this.auth.hasPermission('ROLE_ACCOUNT')
          },
          {separator: true},
          {
            label: 'Parâmetros',
            routerLink: '/metadata',
            visible: this.auth.hasPermission('ROLE_METADATA')
          },
          {
            label: 'Fonte de dados',
            routerLink: '/datasource',
            visible: this.auth.hasPermission('ROLE_DATASOURCE')
          },
          {
            label: 'Query',
            routerLink: '/query',
            visible: this.auth.hasPermission('ROLE_QUERY')
          },
        ]
      },
      {
        label: 'Movimentação',
        items: [
          {
            label: 'Adiantamento',
            routerLink: '/advance',
            visible: this.auth.hasPermission('ROLE_ADVANCE')
          },
          {
            label: 'Rescisão',
            routerLink: '/rescission',
            visible: this.auth.hasPermission('ROLE_RESCISION')
          },
          {
            label: 'Ferias',
            routerLink: '/vacation',
            visible: this.auth.hasPermission('ROLE_VACATION')
          },
          {
            label: 'Folha Pagamento',
            routerLink: '/payroll',
            visible: this.auth.hasPermission('ROLE_PAYROLL')
          },
          {
            label: 'F-LPT2',
            routerLink: '/plpt2',
            visible: this.auth.hasPermission('ROLE_PLPT2')
          },
          {separator: true},
          {
            label: 'Contas a Pagar',
            routerLink: '/payment',
            visible: this.auth.hasPermission('ROLE_PAYMENT_BILL')
          },
        ]
      },
      {
        label: 'Relatórios',
        items: [
          {
            label: 'Folha Pagamento',
            routerLink: '/payroll-report',
            visible: this.auth.hasPermission('ROLE_PAYROLL')
          },
          {
            label: 'DRE Folha Pagamento',
            routerLink: '/payroll-dre-report',
            visible: this.auth.hasPermission('ROLE_PAYROLL')
          },
          {
            label: 'Contas a pagar',
            routerLink: '/payment-report',
            visible: this.auth.hasPermission('ROLE_PAYMENT_BILL')
          },
          {
            label: 'Aliquota',
            routerLink: '/',
            visible: this.auth.hasPermission('-')
          },
          {
            label: 'Colaboradores',
            routerLink: '/',
            visible: this.auth.hasPermission('-')
          },
        ]
      },
      {
        label: 'Sistema',
        items: [
          {
            label: 'Home',
            routerLink: '/home',
          },
        ]
      },
    ];
  }

  logout() {
    this.trace('logout');
    this.handler.clearMessage();
    this.handler.year = '';
    this.handler.month = '';
    this.auth.clearToken();
    this.route.navigate(['/login']);
  }

  private trace(value: string) {
    console.log('NavbarComponent:' + value);
  }
}
