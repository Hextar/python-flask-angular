import {Pipe, PipeTransform, SecurityContext} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(
    private domSanitizer: DomSanitizer
  ) {}
  transform(value: string) {
    if (value) {
      return this.domSanitizer.sanitize(
        SecurityContext.HTML, this.domSanitizer.bypassSecurityTrustHtml(value)
      );
    }
    return value;
  }
}
