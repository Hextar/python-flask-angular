import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-daav-container',
  templateUrl: './daav-container.component.html',
  styleUrls: ['./daav-container.component.scss']
})
export class DaavContainerComponent {
  @Input() tall = false;
  @Input() wide = false;
}
