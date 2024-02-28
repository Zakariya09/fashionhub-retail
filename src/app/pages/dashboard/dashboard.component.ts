import { Component, OnInit } from '@angular/core';
import { AppStrings } from '../../shared/app-strings.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
appStrings:any;
  constructor(
    private appStringsService: AppStrings
  ) { }

  ngOnInit() {
    this.appStrings = this.appStringsService.appStrings;
  }

}
