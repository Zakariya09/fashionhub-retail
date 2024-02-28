import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AppStrings } from '../../shared/app-strings.service';
import { CommonServiceService } from '../../core/services/common-service.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  appStrings: any;
  toggleMenu: boolean = false;
  constructor(
    private router: Router,
    private appStringService: AppStrings,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit() {
    this.appStrings = this.appStringService.appStrings;
    this.commonService.$toggleSubject?.subscribe((isToggleMenu: any) => {
      this.toggleMenu = isToggleMenu;
    })
  }

  logOut():void {
    localStorage.removeItem('userData');
    this.router.navigate(['/login']);
  }
}
