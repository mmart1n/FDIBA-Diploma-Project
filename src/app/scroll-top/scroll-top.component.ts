import { Component } from '@angular/core';

@Component({
  selector: 'app-scroll-top',
  templateUrl: './scroll-top.component.html',
  styleUrls: ['./scroll-top.component.scss']
})
export class ScrollTopComponent {
  public shouldShow: boolean;
  public topPosToStartShowing: number;


  public ngOnInit(): void {
    this.topPosToStartShowing = 75;
    window.addEventListener('scroll', this.checkScroll.bind(this), true);
  }

  public checkScroll(): void {
    // Both window.pageYOffset and document.documentElement.scrollTop returns the same result in all the cases. window.pageYOffset is not supported below IE 9.

    const scrollPosition = document.body.scrollTop || 0;

    if (scrollPosition >= this.topPosToStartShowing) {
      this.shouldShow = true;
    } else {
      this.shouldShow = false;
    }
  }

  public gotoTop(btn): void {
    document.getElementById('navbar').scrollIntoView({ behavior: 'smooth' });
    btn.blur();
  }

  public ngOnDestroy(): void {
    window.removeEventListener('scroll', this.checkScroll.bind(this), true);
  }
}
