import {Component, Input, OnInit, ContentChildren, QueryList} from '@angular/core';
import {ColumnHeaderComponent} from './column-header.component';
import * as _ from 'lodash';
import { FixtableColumnDirective } from './fixtable-column.directive';



export interface Column {
  property: string;
  label?: string;
  width?: number;
  sortable?: boolean;
  sortCompareMethod?: (a, b) => number;
  hideLabel?: boolean;
  cellClass?: string;
  component?: string;
  actionButton?: boolean;
  onActionButton?: Function;
}

export interface FixtableOptions {
  data: any[]; // For now, pass in the data array. This is different than the original signature in fixtable-angular
               // but makes more sense with the Angular2 programming model
  columns: Column[];
  tableClass?: string;
  loading?: string;
}

//1 

@Component({
  selector: 'fixtable-grid',
  template: `
  <div *ngIf="externalFilter">
    <input ngModel="externalFilter" />
  </div>
  <table [ngClass]="tableClass">
    <thead>
      <tr>
        <th *ngFor="let column of columns" scope="col">
          <fixtable-column-header [SortByProperty]="SortByProperty" [column]="column"></fixtable-column-header>
        </th>
      <tr>
    </thead>
    <tr *ngFor="let record of data">
      <td *ngFor="let column of columns; let i = index">
        <ng-template
          *ngIf="column.cellTemplate"
          [ngTemplateOutlet]="column.cellTemplate"
          [ngTemplateOutletContext]="{row: record, value: record[column.property]}"
        ></ng-template>
        <span
          *ngIf="!column.cellTemplate"
          [ngClass]="column.cellClasses"
        >{{record[column.property]}}</span>
      </td>
    </tr>
    <tfoot>
      <tr>
        <td [colSpan]="columns.length" >Footer</td>
      </tr>
    </tfoot>
  </table>
  `,

        // <td *ngFor="let column of columns" scope="col">
        //   Footer
        // </td>
  //TODO: Finish adding scrollable content css from https://www.sitepoint.com/community/t/flexible-html-table-with-fixed-header-and-footer-around-a-scrollable-body/271162/2
  styles: [`
    table {
      max-width:980px;
      table-layout:fixed;
      margin:auto;
    }
    th, td {
      padding:5px 10px;
      border:1px solid #000;
    }
    thead, tfoot {
      background:#f9f9f9;
      display:table;
      width:100%;
      width:calc(100% - 18px);
    }
    tbody {
      height:300px;
      overflow:auto;
      overflow-x:hidden;
      display:block;
      width:100%;
    }
    tbody tr {
      display:table;
      width:100%;
      table-layout:fixed;
    }
  `]
})
export class GridComponent implements OnInit {

  // Options params
  data;
  columns;
  externalFilter;
  tableClass;

  _columnTemplates;

  @Input() options: FixtableOptions;

  @ContentChildren(FixtableColumnDirective)
  set columnTemplates(val: QueryList<FixtableColumnDirective>) {
    this._columnTemplates = val;
  }


  // get columTemplates(): QueryList<FixtableColumnDirective> {
  //   return this._columnTemplates;
  // }

  constructor() {
  }

  private ascending = true;

  SortByProperty = ((property: string) => {
    const defaultSortCompareMethod = (a, b) => a[property] > b[property];

    // Switch to a custom comparator later
    const sortCompareMethod = defaultSortCompareMethod;

    if (this.ascending) {
      this.data.sort(sortCompareMethod);
    } else {
      this.data.sort((a, b) => !sortCompareMethod(a, b));
    }
    this.ascending = !this.ascending;
  });


  ngOnInit() {
    if (this.options) {
      this.data = this.options.data;
      this.columns = this.options.columns;
      this.externalFilter = this.options.columns;
      this.tableClass = this.options.tableClass;
    }
  }

}
