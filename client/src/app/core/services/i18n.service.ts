import {Injectable, OnDestroy} from '@angular/core';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {includes} from 'lodash';
import {registerLocaleData} from '@angular/common';
import localeIt from '@angular/common/locales/it';
import * as moment from 'moment';
import 'moment/locale/it';
import 'moment/locale/en-gb';

// @ts-ignore
import itIT from '@i18n/it-IT.json';
// @ts-ignore
import enUS from '@i18n/en-US.json';

import {Observable} from 'rxjs';
import {MatPaginatorIntl} from '@angular/material';

const languageKey = 'daav-language';

/**
 * Pass-through function to mark a string for translation extraction.
 * Running `npm translations:extract` will include the given string by using this.
 * @param {string} s The string to extract for translation.
 * @return {string} The same string.
 */
export function extract(s: string) {
  return s;
}

export const defaultLanguageCode = 'it';

@Injectable()
export class I18nService implements OnDestroy {
  defaultLanguage: string;
  supportedLanguages: string[];

  constructor(
    private translate: TranslateService
  ) {
    // Embed languages to avoid extra HTTP requests
    translate.setTranslation('itIT', itIT);
    translate.setTranslation('enUS', enUS);

    registerLocaleData(localeIt, defaultLanguageCode);
    moment.locale(defaultLanguageCode);
  }

  ngOnDestroy() {
    // Empty beause '.takeUntil(componentDestroyed(this))' is used
  }

  /**
   * Initializes i18n for the application.
   * Loads language from local storage if present, or sets setDefault language.
   * @param {!string} defaultLanguage The setDefault language to use.
   * @param {Array.<String>} supportedLanguages The list of supported languages.
   */
  init(defaultLanguage: string, supportedLanguages: string[]) {
    this.defaultLanguage = defaultLanguage;
    this.supportedLanguages = supportedLanguages;
    this.language = defaultLanguage;
    localStorage.setItem(languageKey, defaultLanguage);
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      localStorage.setItem(languageKey, event.lang);
    });
  }

  /**
   * Sets the current language.
   * Note: The current language is saved to the local storage.
   * If no parameter is specified, the language is loaded from local storage (if present).
   * @param {string} language The IETF language code to set.
   */
  set language(language: string) {
    language = language || localStorage.getItem(languageKey) || this.translate.getBrowserCultureLang();
    let isSupportedLanguage = includes(this.supportedLanguages, language);

    // If no exact match is found, search without the region
    if (language && !isSupportedLanguage) {
      language = language.split('-')[0];
      language = this.supportedLanguages.find(supportedLanguage => supportedLanguage.startsWith(language)) || '';
      isSupportedLanguage = Boolean(language);
    }

    // Fallback if language is not supported
    if (!isSupportedLanguage) {
      language = this.defaultLanguage;
    }
    this.translate.use(language);
  }

  /**
   * Gets the current language.
   * @return {string} The current language code.
   */
  get language(): string {
    return this.translate.currentLang;
  }

  /**
   * Gets a word translated.
   * @return {string} The word translated matching the key.
   */
  public getTranslation(keys: string[]): Observable<string | any> {
    return this.translate.get(keys);
  }
}

export class PaginatorI18n {

  constructor(
    private translate: TranslateService
  ) {
  }

  getPaginatorIntl(): MatPaginatorIntl {
    const paginatorIntl = new MatPaginatorIntl();
    paginatorIntl.itemsPerPageLabel = this.translate.instant('paginator.ITEMS_PER_PAGE_LABEL');
    paginatorIntl.nextPageLabel = this.translate.instant('paginator.NEXT_PAGE_LABEL');
    paginatorIntl.previousPageLabel = this.translate.instant('paginator.PREVIOUS_PAGE_LABEL');
    paginatorIntl.firstPageLabel = this.translate.instant('paginator.FIRST_PAGE_LABEL');
    paginatorIntl.lastPageLabel = this.translate.instant('paginator.LAST_PAGE_LABEL');
    paginatorIntl.getRangeLabel = this.getRangeLabel.bind(this);
    return paginatorIntl;
  }

  private getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0 || pageSize === 0) {
      return this.translate.instant('paginator.RANGE_PAGE_LABEL_1', {length});
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return this.translate.instant('paginator.RANGE_PAGE_LABEL_2', {startIndex: startIndex + 1, endIndex, length});
  }
}
