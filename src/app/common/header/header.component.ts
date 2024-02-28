import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonServiceService } from '../../core/services/common-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  toggleSideMenu: boolean = false;
  constructor(
    private router: Router,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit() {
  }

  toggleSidebar(): void {
    this.toggleSideMenu = !this.toggleSideMenu;
    this.commonService.$toggleSubject.next(this.toggleSideMenu);
  }

  logOut() {
    localStorage.removeItem('userData');
    this.router.navigate(['/login']);
  }

}
