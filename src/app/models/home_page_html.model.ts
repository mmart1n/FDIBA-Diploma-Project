import { SiteState } from './site_state.model';

export class HomePageHtml {

  public text: string;
  public isSiteWorking: SiteState;

  constructor(text: string, isSiteWorking: SiteState) {
    this.text = text;
    this.isSiteWorking = new SiteState(isSiteWorking.id, isSiteWorking.isWorking);
  }

}
