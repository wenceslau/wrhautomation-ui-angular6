import { AuthorizerService } from './../authorizer.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HandlerService } from '../../core/services/handler.service';
import { DialogService } from 'ng2-bootstrap-modal';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthorizerService,
    private router: Router,
    private handlerService: HandlerService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
  }

  login(username: string, password: string) {
    this.handlerService.clearMessage();
    this.handlerService.block();
    this.authService.login(username, password)
      .then(() => {
        this.handlerService.unblock();
        this.router.navigate(['/home']);
      })
      .catch(error => {
        this.handlerService.handleError(error);
      });
  }
}
