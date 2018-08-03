import { Component, OnInit } from '@angular/core';
import { AuthorizerService } from '../../security/authorizer.service';
import { Router } from '@angular/router';
import { AccountService } from '../../maintenance/services/account.service';
import { ToastyService } from 'ng2-toasty';
import { HandlerService } from '../services/handler.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  displayInput: boolean;

  constructor(public auth: AuthorizerService,
    private accountService: AccountService,
    private toasty: ToastyService,
    public handler: HandlerService,
    private router: Router) {
  }

  ngOnInit() {
  }

  showUser() {
    return this.router.url !== '/login';
  }

  change(oldp: string, newp: string) {
    this.trace('change');
    this.accountService.changePassword(oldp, newp)
      .then(result => {
        this.displayInput = false;
        this.toasty.success('Senha alterada com sucesso');
      }).catch(erro => { this.handler.handleError(erro); });
  }

  private trace(value: string) {
    console.log('HeaderComponent:' + value);
  }
}
