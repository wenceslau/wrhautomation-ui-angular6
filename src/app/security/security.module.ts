import { Http, RequestOptions } from '@angular/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { AuthorizerGuard } from './authorizer.guard';

// Funcao que retorna um authhttp, objeto http usando para rquest com tokens oauth2
export function authServiceFactory(http: Http, options: RequestOptions) {
  const config = new AuthConfig({
    // adiciona o content type para o AuthHttp
    globalHeaders: [
      { 'Content-Type': 'application/json' }
    ]
  });
  return new AuthHttp(config, http, options);
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    InputTextModule,
    ButtonModule,
  ],
  declarations: [LoginComponent],
  providers: [
    {
      provide: AuthHttp,  // Injeta o provider que cria o AuthHttp
      useFactory: authServiceFactory, // Funcao que cria o AuthHttp
      deps: [Http, RequestOptions] // Parametros que a funcao precisa receber
    },
    AuthorizerGuard
  ]
})
export class SecurityModule { }
