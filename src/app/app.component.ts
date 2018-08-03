import { HandlerService } from './core/services/handler.service';
import { Component } from '@angular/core';
import { ToastyConfig } from 'ng2-toasty';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';


  // Injeção para usar o tema no tosty
  constructor(
    private toastyConfig: ToastyConfig,
    private router: Router,
    public handleService: HandlerService) {

    this.toastyConfig.theme = 'bootstrap';
  }

  showMenu() {
    return this.router.url !== '/login';
  }

}
