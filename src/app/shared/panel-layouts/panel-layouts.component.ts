import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-panel-layouts',
  templateUrl: './panel-layouts.component.html',
  styleUrls: ['./panel-layouts.component.scss']
})
export class PanelLayoutsComponent implements OnInit {

  public isCollapsed: boolean;
  public isMobile: boolean;
  private resizeTimeout: any;

  @HostListener('window:resize', ['$event']) onResize(event) {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout((() => {
      if (event.target.innerWidth < 992) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
        this.isCollapsed = false;
      }
    }).bind(this), 500);
  }

  constructor() { }

  ngOnInit(): void {
    if (window.innerWidth < 992) { // 768px portrait
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  handleMenuCollapse(): void {
    if (this.isMobile) {
      this.isCollapsed = !this.isCollapsed;
    }
  }
}
