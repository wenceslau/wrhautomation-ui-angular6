import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-report',
  template: `
      <div>
      <embed [src]="sanitizer.bypassSecurityTrustResourceUrl(pdfSrc)" type="application/pdf" width="1024" height="450">
      </div>
  `,
  styles: []
})
export class ReportComponent {

  @Input() pdfSrc: any;

  constructor(public sanitizer: DomSanitizer) { }

}
