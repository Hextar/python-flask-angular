import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { environment } from '@env/environment';

@Component({
  selector: 'app-daav-container',
  templateUrl: './daav-container.component.html',
  styleUrls: ['./daav-container.component.scss']
})
export class DaavContainerComponent implements OnInit {
  currentYear: number = moment().year();
  environment = environment.label;

  @Input() anonymous = false;
  @Input() tall = false;
  @Input() wide = false;

  constructor() {}

  ngOnInit() {
    //
  }
}
