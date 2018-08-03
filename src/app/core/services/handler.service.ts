import { AuthorizerService } from './../../security/authorizer.service';
import { Injectable } from '@angular/core';

import { Response } from '@angular/http';

import { MessageService } from 'primeng/components/common/messageservice';
import { Message } from 'primeng/components/common/api';
import { AuthHttpError } from 'angular2-jwt';
import { DialogService } from 'ng2-bootstrap-modal';
import { Router } from '@angular/router';
import { style } from '@angular/animations';

@Injectable()
export class HandlerService {

  canPrintPayment: boolean;

  // Propriedade alert 
  title: string;
  message: string;
  stack: string[];
  showError: boolean;
  showWarn: boolean;
  showInfo: boolean;

  msgs: Message[] = [];
  grws: Message[] = [];

  month: string;
  year: string;

  navigation = 'Home';
  infoMessage = '';

  blockedDocument: Boolean = false;

  constructor(private messageService: MessageService,
    private auth: AuthorizerService,
    private dialogService: DialogService,
    private router: Router) {
  }

  handleError(error: Response) {

    let value;
    let errorJson;
    let stacks = [];

    if (error instanceof Response) {
      this.trace('Error is Response: ' + error.toString());

      if (error.status !== 0) {
        this.trace('error.status: ' + error.status);
        try {
          errorJson = error.json();
          this.trace('errorJson: ' + JSON.stringify(error));
          stacks.push('url: ' + error.url)

          // tem o campo stack, erro personalizado
          if (errorJson.stacks) {
            this.trace('error.stacks: ' + errorJson.stacks);
            value = errorJson.message;
            value += '. ' + errorJson.field;

            errorJson.stacks.forEach(element => {
              stacks.push(element)
            });

          } else { // Erro convencional
            if (errorJson.timestamp) {
              stacks.push('timestamp: ' + errorJson.timestamp);
            }
            if (errorJson.status) {
              stacks.push('status: ' + errorJson.status);
            }
            if (errorJson.error) {
              stacks.push('error: ' + errorJson.error);
            }
            if (errorJson.exception) {
              stacks.push('exception: ' + errorJson.exception);
            }
            if (errorJson.message) {
              value = errorJson.message;
              stacks.push('message: ' + errorJson.message);
            }
            if (errorJson.path) {
              stacks.push('path: ' + errorJson.path);
            }
          }
        } catch (e) {
          value = error.toString();
        }
      } else {
        value = 'O servidor de aplicação não está acessível.';
        stacks.push(error.toString());
        stacks.push(JSON.stringify(errorJson));
      }

    } else if (typeof error === 'string') {
      this.trace('Error is String: ' + error);
      value = error;

    } else {
      this.trace('Error is Object: ' + error);
      stacks.push(error);
      value = "Voce não está logado, ou sua sessão expirou. Realize novo login";

    }

    this.finally(value, stacks);
  }

  handleInfo(value: string) {
    this.messageService.add({ severity: 'success', summary: 'Service Message', detail: 'Via MessageService' });
  }

  block() {
    setTimeout(() => {
      this.blockedDocument = true;
    }, 1);
  }

  unblock() {
    setTimeout(() => {
      this.blockedDocument = false;
    }, 1);
  }

  clearMessage() {
    this.messageService.clear();
  }

  showDialogError(message: string, stacks: string[]) {
    this.title = 'Error';
    this.message = message;
    this.stack = stacks;
    setTimeout(() => {
      this.showError = true;
    }, 50);
    
  }

  showDialogWarn(message: string) {
    this.title = 'Alerta';
    this.message = message;
    this.stack = [];
    setTimeout(() => {
      this.showWarn = true;
    }, 50);
  }

  showDialogInfo(message: string) {
    this.title = 'Informação';
    this.message = message;
    this.stack = [];
    setTimeout(() => {
      this.showInfo = true;
    }, 50);
  }

  setNavigation(navigation: string) {
    setTimeout(() => {
      this.navigation = navigation;
    }, 10);

  }

  setInfoMessage(infoMessage: string) {
    this.infoMessage = infoMessage;
  }

  private finally(value: string, stack: string[]) {
    this.unblock();
    this.showDialogError(value, stack);
    console.error(value + ' - ' + stack);
  }

  private trace(value: string) {
    console.log('HandlerService:' + value);
  }

}
