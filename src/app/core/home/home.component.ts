import { Component, OnInit } from '@angular/core';
import { HandlerService } from '../services/handler.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public handler: HandlerService) { }

  ngOnInit() {
    this.handler.setNavigation('[ Home ]');
  }

}
