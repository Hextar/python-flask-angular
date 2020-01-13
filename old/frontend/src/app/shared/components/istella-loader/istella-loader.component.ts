import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-istella-loader',
  templateUrl: './istella-loader.component.html',
  styleUrls: ['./istella-loader.component.scss']
})
export class IstellaLoaderComponent {
  @Input() isLoading: boolean;
  @Input() fullHeight = false;
  @Input() minHeight: number;
  @Input() maxHeight: number;
  @Input() message: string;
  @Input() diameter: string;
  @Input() size = 1.5;
  @Input() color = 'primary';
}
