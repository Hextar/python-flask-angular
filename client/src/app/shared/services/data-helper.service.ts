import { Injectable } from '@angular/core';
import { Moment } from 'moment';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DateHelperService {
  dateFormat = {
    FULL_DATE: 'DD MMMM YYYY HH:mm',
    SHORT_DATE: 'DD/MM/YY',
    NO_YEAR: 'DD MMMM HH:mm',
    CLOCK_ONLY: 'HH:mm'
  };

  constructor() {
  }

  now(): number {
    return moment().unix();
  }

  timezoneOffset(): number {
    return moment().utcOffset();
  }

  parse(n: number): Moment {
    return (n <= 1000) ? moment(n) : moment.unix(n);
  }

  isSameOrAfter(checkingAgainst: Moment, validatorField: { [key: string]: boolean }): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      const date1: Moment = moment.isMoment(c.value)
        ? c.value.startOf('minute') : moment(c.value, this.dateFormat.FULL_DATE).startOf('minute');
      const date2: Moment = moment.isMoment(checkingAgainst)
        ? checkingAgainst.startOf('minute') : moment.unix(checkingAgainst).startOf('minute');
      if (date1 && date2 && moment.isMoment(date1) && moment.isMoment(date2) && date1.isSameOrAfter(date2)) {
        return null;
      } else {
        return validatorField;
      }
    };
  }

  isSameOrBefore(checkingAgainst: Moment, validatorField: { [key: string]: boolean }): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      const date1: Moment = moment.isMoment(c.value)
        ? c.value.startOf('minute') : moment(c.value, this.dateFormat.FULL_DATE).startOf('minute');
      const date2: Moment = moment.isMoment(checkingAgainst)
        ? checkingAgainst.startOf('minute') : moment.unix(checkingAgainst).startOf('minute');
      if (date1 && date2 && moment.isMoment(date1) && moment.isMoment(date2) && date1.isSameOrBefore(date2)) {
        return null;
      } else {
        return validatorField;
      }
    };
  }

  isBefore(checkingAgainst: Moment, validatorField: { [key: string]: boolean }): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      const date1: Moment = moment.isMoment(c.value)
        ? c.value.startOf('minute') : moment(c.value, this.dateFormat.FULL_DATE).startOf('minute');
      const date2: Moment = moment.isMoment(checkingAgainst)
        ? checkingAgainst.startOf('minute') : moment.unix(checkingAgainst).startOf('minute');
      if (date1 && date2 && moment.isMoment(date1) && moment.isMoment(date2) && date1.isBefore(date2)) {
        return null;
      }
      return validatorField;
    };
  }

  isAfter(checkingAgainst: Moment, validatorField: { [key: string]: boolean }): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      const date1: Moment = moment.isMoment(c.value)
        ? c.value.startOf('minute') : moment(c.value, this.dateFormat.FULL_DATE).startOf('minute');
      const date2: Moment = moment.isMoment(checkingAgainst)
        ? checkingAgainst.startOf('minute') : moment.unix(checkingAgainst).startOf('minute');
      if (date1 && date2 && moment.isMoment(date1) && moment.isMoment(date2) && date1.isAfter(date2)) {
        return null;
      }
      return validatorField;
    };
  }

  dateInThePast(date: number | Moment): boolean {
    if (date && typeof date === 'number') {
      return moment.unix(date).isBefore(moment());
    } else if (date && typeof date !== 'number' && date instanceof moment) {
      return date.isBefore(moment());
    } else {
      return false;
    }
  }

  dateEqualsOrInThePast(date: number | Moment): boolean {
    if (date && typeof date === 'number') {
      return moment.unix(date).isSameOrBefore(moment());
    } else if (date && typeof date !== 'number') {
      return date.isSameOrBefore(moment());
    } else {
      return false;
    }
  }

  dateInTheFuture(date: number): boolean {
    return date ? !this.dateInThePast(date) : false;
  }

  dateToday(date: number | Moment): boolean {
    if (date && typeof date === 'number') {
      return moment.unix(date).year() === moment().year() &&
        moment.unix(date).month() === moment().month() &&
        moment.unix(date).day() === moment().day();
    } else if (date && typeof date !== 'number') {
      return date.year() === moment().year() &&
        date.month() === moment().month() &&
        date.day() === moment().day();
    } else {
      return false;
    }
  }

  SortbyDate(data: any[], property: string, ascending: boolean = true): any[] {
    return data.sort((a: any, b: any) => {
      let result = 0;
      if (a && b && a[property] && b[property]) {
        if (a[property] < b[property]) {
          result = -1;
        } else if (a[property] > b[property]) {
          result = 1;
        } else {
          result = 0;
        }
      }
      return (ascending) ? result * -1 : result;
    });
  }

  numberToStringDate(x: number, keepLocalTime: boolean = true): string {
    const sameYear = moment.unix(x).year() === moment().year();
    const format = sameYear ? this.dateFormat.NO_YEAR : this.dateFormat.FULL_DATE;
    return moment
      .unix(x)
      .utcOffset(0, keepLocalTime)
      .format(format)
      .split(' ')
      .map(s => {
        return s.charAt(0).toUpperCase() + s.substr(1);
      })
      .toString()
      .replace(/,/g, ' ');
  }

  numberToShortStringDate(x: number, keepLocalTime: boolean = true): string {
    const format = this.dateFormat.SHORT_DATE;
    return moment
      .unix(x)
      .utcOffset(0, keepLocalTime)
      .format(format)
      .split(' ')
      .map(s => {
        return s.charAt(0).toUpperCase() + s.substr(1);
      })
      .toString()
      .replace(/,/g, ' ');
  }

  starsIn(x: number): string {
    const diff = moment.unix(x).diff(moment());
    if (diff <= 10000) {
      return 'Qualche secondo';
    } else if (diff <= 60000) {
      return '1 minuto';
    } else {
      return '';
    }
  }

  endsIn(x: number): string {
    const diff = moment.unix(x).diff(moment());
    if (diff <= 10000) {
      return 'Qualche secondo';
    } else if (diff <= 60000) {
      return '1 minuto';
    } else {
      return '';
    }
  }

  secondsToNextMinute(second: number = 0): number {
    const s = moment().second();
    return second < s ? 60 - s + second : second - s;
  }

  millisecondsToNextMinute(second: number = 0): number {
    return this.secondsToNextMinute(second) * 1000; // convert to milliseconds
  }

}
