import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-loader',
  templateUrl: './custom-loader.component.html',
  styleUrls: ['./custom-loader.component.scss']
})
export class CustomLoaderComponent {
  @Input() isLoading: boolean;
  @Input() fullHeight = false;
  @Input() minHeight: number;
  @Input() maxHeight: number;
  @Input() message: string;
  @Input() diameter: string;
  @Input() size = 1.5;
  @Input() color = 'primary';
}
