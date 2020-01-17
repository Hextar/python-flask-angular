import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tableColumnId',
  pure: true
})
export class TableColumnIdPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (value) {
      if (value.length === 0) {
        return [];
      }
      return value.map((v: any) => v.id);
    }
  }
}
