import { Injectable } from '@angular/core';
import { CoreService } from '../../core/services/core.service';
import * as moment from 'moment';
import { ResponseContentType } from '@angular/http';

@Injectable()
export class ReportService {

  private path = '';

  constructor(private service: CoreService) { }

  payrollReport(referenceMonth: Date) {

    const fullPath = this.path + '/payroll/reportByReferenceMonth?referenceMonth='
      + moment(referenceMonth).format('YYYY-MM-DD');

      
    return this.service.report(fullPath);
  }

  payrollDreReport(referenceMonth: Date) {

    const fullPath = this.path + '/payroll/reportDetailedDreByReferenceMonth?referenceMonth='
      + moment(referenceMonth).format('YYYY-MM-DD');

      
    return this.service.report(fullPath);
  }

  paymentReport(referenceMonth: Date) {

    const fullPath = this.path + '/paymentBill/reportPaymentBillByReferenceMonth?referenceMonth='
      + moment(referenceMonth).format('YYYY-MM-DD');

      
    return this.service.report(fullPath);
  }

}
