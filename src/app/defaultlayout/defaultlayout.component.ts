import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../core/services/common-service.service';

@Component({
  selector: 'app-defaultlayout',
  templateUrl: './defaultlayout.component.html',
  styleUrls: ['./defaultlayout.component.css']
})
export class DefaultlayoutComponent implements OnInit {
  toggleSideMenu: boolean = false;

  constructor(
    private commonService: CommonServiceService,
  ) { }

  ngOnInit() {
    this.commonService.$toggleSubject?.subscribe((isToggleMenu: any) => {
      this.toggleSideMenu = isToggleMenu;
    })
  }
}
