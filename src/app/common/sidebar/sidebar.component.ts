import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  userData = JSON.parse(localStorage.getItem('userData') || '');
  constructor(private router: Router ) { }

  ngOnInit() {
  }
  logOut(){
    localStorage.removeItem('userData');
    this.router.navigate(['/login']);
   }
}
