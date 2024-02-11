// filter.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  /**
   * Pipe filters the list of elements based on the search text provided
   *
   * @param items list of elements to search in
   * @param searchText search string
   * @returns list of elements filtered by search text or []
   */
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
  
    return items.filter(item => {
      return Object.keys(item).some(key => {
        if(key == 'id') return false
        return String(item[key]).toLowerCase().includes(searchText.toLowerCase());
      });
    });
  } 
}