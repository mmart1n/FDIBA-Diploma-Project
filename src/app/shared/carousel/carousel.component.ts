import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent {
  @Input() public connectionFailedMessage;

  public slides = [
    {
      src: "../../assets/FDIBA_nova_sgrada_template.jpg"
    },
    {
      src: "../../assets/Diplomirane_2.jpg"
    },
    {
      src: "../../assets/Diplomirane_3.jpg"
    }
  ];


}
