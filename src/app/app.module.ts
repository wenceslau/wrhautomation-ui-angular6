import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http'; // Usado para usar conexoes htto nos services
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MessagesModule } from 'primeng/messages';

import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { AppRouterModule } from './app-router.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    HttpModule,
    BrowserModule,
    BrowserAnimationsModule,
    MessagesModule,             // Modulo do componente p-messages que esta no app.html

    AppRouterModule,            // Modulo de rotas as aplicacao
    CoreModule,                 // Importa o modulo Core e todos os modulo que o core importa e exporta
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
