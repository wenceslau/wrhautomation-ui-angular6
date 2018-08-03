import { Component, OnInit } from '@angular/core';
import { ReportService } from '../services/report.service';
import { DomSanitizer } from '@angular/platform-browser';

import * as moment from 'moment';
import { HandlerService } from '../../core/services/handler.service';

@Component({
  selector: 'app-payroll-report',
  templateUrl: './payroll-report.component.html',
  styleUrls: ['./payroll-report.component.css']
})
export class PayrollReportComponent implements OnInit {

  page = '';
  pdfSrc: any;
  rerender: boolean;
  referenceMonth: Date;
  month: string;
  year: string;

  months = [
    { label: 'Janeiro', value: '1' },
    { label: 'Fevereiro', value: '2' },
    { label: 'Março', value: '3' },
    { label: 'Abril', value: '4' },
    { label: 'Maio', value: '5' },
    { label: 'Junho', value: '6' },
    { label: 'Julho', value: '7' },
    { label: 'Agosto', value: '8' },
    { label: 'Setembro', value: '8' },
    { label: 'Outubro', value: '10' },
    { label: 'Novembro', value: '11' },
    { label: 'Dezembro', value: '12' },
  ];

  constructor(
    private reportService: ReportService,
    public handler: HandlerService,
    public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.rerender = false;
    this.handler.setInfoMessage('');
    this.handler.setNavigation(this.page);
    this.month = this.handler.month;
    this.year = this.handler.year;
    this.trace('this.month' + this.month);
    this.referenceMonth = this.getReferenceMonth();
  }

  generateReport() {
    this.trace('generateReport');
    this.referenceMonth = this.getReferenceMonth();

    this.reportService.payrollReport(this.referenceMonth)
      .then(relatorio => {
        const uri = window.URL.createObjectURL(relatorio);
        window.open(uri);
        // this.pdfSrc = uri;
        // setTimeout(() => {
        //   this.rerender = true;
        // }, 100);
      }).catch(erro => { this.handler.handleError(erro); });
  }
  
  getReferenceMonth(): Date {
    this.trace('getReferenceMonth');
    if (this.month && this.year) {
      this.handler.month = this.month;
      this.handler.year = this.year;
      return moment(this.year + '-' + this.month + '-1', 'YYYY-MM-DD').toDate();
    }
  }

  private trace(value: string) {
    console.log('PayrollReportComponent:' + value);
  }
}
