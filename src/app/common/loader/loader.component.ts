import { Component, OnInit } from "@angular/core";
import { CommonServiceService } from "../../core/services/common-service.service";

export interface Loader {
    showLoader:boolean;
}
@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.css']
})
export class AppLoader implements OnInit {
    showLoader: boolean = false;
    constructor(private commonService: CommonServiceService) { }
    ngOnInit(): void {
        this.commonService.$loaderSubject?.subscribe((data: Loader) => {
            this.showLoader = data.showLoader;
        });
    }
}