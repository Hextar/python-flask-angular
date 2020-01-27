import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { noop, Observable } from 'rxjs';
import { STOCK_LIST } from '@private/components/filters/filters.constants';
import { FormControl } from '@angular/forms';
import { debounceTime, filter, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent {
  @Input() isLoading = false;
  @Input() stocksToAnalyse: string[];
  @Output() stocksToAnalyseChange = new EventEmitter<string[]>(true);
  @Input() start: string;
  @Output() startChange = new EventEmitter<string>(true);
  @Input() end: string;
  @Output() endChange = new EventEmitter<string>(true);
  @Input() maxStocksAvailable = 5;
  @Input() stocksColors: string[];
  @Input() mobile: boolean;

  removable = true;
  addOnblur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  stocksCtrl = new FormControl();
  filteredStocks: Observable<string[]>;
  autocompleteStocks: string[] = STOCK_LIST;

  @ViewChild('stockInput', {static: false}) stockInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  constructor() {
    this.filteredStocks = this.stocksCtrl.valueChanges.pipe(
      startWith(null),
      map((stock: string | null) => {
        console.log('VALUE CHANGED', stock);
        return stock ? this._filter(stock) : this.autocompleteStocks.slice();
      })
    );
  }

  addStock(event: MatChipInputEvent) {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      (value || '').trim() ? this.stocksToAnalyse.push(value.trim()) : noop();

      // Reset the input value
      input ? input.value = '' : noop();

      this.stocksCtrl.setValue(null);

      // Reload the stocks
      this.stocksToAnalyseChange.emit(this.stocksToAnalyse);
    }
  }

  removeStock(stock: string) {
    // Get the stock index
    const idx = this.stocksToAnalyse.indexOf(stock);

    // Remove the stock
    idx > 0 ? this.stocksToAnalyse.splice(idx, 1) : noop();

    // Reload the stocks
    this.stocksToAnalyseChange.emit(this.stocksToAnalyse);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.stocksToAnalyse.push(event.option.viewValue);
    this.stockInput.nativeElement.value = '';
    this.stocksCtrl.setValue(null);
  }

  get stocksAvailable(): number {
    if (this.maxStocksAvailable && this.stocksToAnalyse) {
      return this.maxStocksAvailable - this.stocksToAnalyse.length;
    }
    return 0;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    // Filter the Stock List
    return this.autocompleteStocks.filter(s => s.toLowerCase().indexOf(filterValue) === 0);
  }


}
