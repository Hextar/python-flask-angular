import { HammerGestureConfig } from '@angular/platform-browser';
import { Injectable } from '@angular/core';

declare var Hammer: any;

@Injectable()
export class AppHammerConfig extends HammerGestureConfig {
  buildHammer(element: HTMLElement) {
    const mc = new Hammer(element, {
      touchAction: 'auto',
    });
    return mc;
  }
}
