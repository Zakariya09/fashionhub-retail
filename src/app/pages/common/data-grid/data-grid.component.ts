import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppStrings } from '../../../shared/app-strings.service';
import { HtmlTagDefinition } from '@angular/compiler';

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrl: './data-grid.component.css',
})
export class DataGridComponent {
  p = 1;
  textSearch = '';
  @Input() rows!: any;
  appStrings: any;
  @Input() columns: string[] = [];
  @Input() warningText: string = '';
  @Input() activeForm!: string;
  @Input() formTitle!: string;
  @Output() invokeEdit = new EventEmitter();
  @Output() invokeDelete = new EventEmitter();
  @Output() invokeAddForm = new EventEmitter();
  @Input() addBtnTitle!: string;
  @Input() activeGrid!: string;
  @Input() targetModal!: string;

  constructor(private appStringsService: AppStrings) {}
  ngOnInit() {
    this.appStrings = this.appStringsService.appStrings;
  }

  addForm(formType: string) {
    this.invokeAddForm.emit(formType);
  }
  edit(data: any, formType: string) {
    this.invokeEdit.emit({ data, formType });
  }
  confirmDelete(data: any, formType: string) {
    this.invokeDelete.emit({ data, formType });
  }
}
