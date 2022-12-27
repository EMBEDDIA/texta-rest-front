import {UntypedFormControl} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {debounceTime} from 'rxjs/operators';

export class TableFilter {

  constructor(public filterPropertyName: string, public filterCurrentValue: string, public filterControl?: UntypedFormControl) {

  }
}

export class TableFilterManager {
  private filterList: TableFilter[] = [];
  private filterPropertyObject: { [key: string]: string } = {};

  constructor() {

  }

  addFilter(filter: TableFilter): void {
    this.filterList.push(filter);
    this.filterPropertyObject[filter.filterPropertyName] = filter.filterCurrentValue;
  }

  // tslint:disable-next-line:no-any
  setUpColumnFilters(tableData: MatTableDataSource<any>): void {
    for (const tableFilter of this.getFilterList()) {
      if (tableFilter.filterControl) {
        tableFilter.filterControl.valueChanges.pipe(debounceTime(400)).subscribe((filterValue) => {
          this.getFilterPropertyObject()[tableFilter.filterPropertyName] = filterValue;
          tableData.filter = JSON.stringify(this.getFilterPropertyObject());
        });
      }
    }
    tableData.filterPredicate = this.customFilterPredicate();
  }

  getFilterPropertyObject(): { [key: string]: string } {
    return this.filterPropertyObject;
  }

  getFilterList(): TableFilter[] {
    return this.filterList;
  }
  // tslint:disable-next-line:no-any
  customFilterPredicate(): (data: any, filter: string) => boolean {
    // tslint:disable-next-line:no-any
    return (data: any, filter: string) => {
      const searchString = JSON.parse(filter);
      // tablefilters have priority, filter out based on those values first
      for (const key of Object.keys(searchString)) {
        // @ts-ignore
        if (data[key]) {
          // @ts-ignore
          const search = data[key].trim().toLowerCase().indexOf(searchString[key].trim().toLowerCase()) !== -1;
          if (search) {
          }
          if (!search) {
            return false;
          }
        } else { // @ts-ignore
          if (searchString[key] && !data[key]) {
            return false;
          }
        }
      }
      // if no global search then done
      return true;

    };
  }
}
