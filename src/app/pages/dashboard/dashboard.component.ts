import { Component, OnInit } from '@angular/core';
import { AppStrings } from '../../shared/app-strings.service';
import { Subject } from 'rxjs';
import { CommonServiceService } from '../../core/services/common-service.service';
import { AppUtilityService } from '../../core/services/app-utility.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
appStrings:any;
subscription = new Subject();
  constructor(
    private appStringsService: AppStrings,
    private commonService: CommonServiceService,
    private utilityService: AppUtilityService
  ) { }

  ngOnInit() {
    this.appStrings = this.appStringsService.appStrings;
  }
}
