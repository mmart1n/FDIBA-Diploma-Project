import { Component, OnInit, ViewChild } from "@angular/core";
import { IgxDialogComponent } from "igniteui-angular";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: 'app-logout-warning',
  templateUrl: './logout-warning.component.html',
  styleUrls: ['./logout-warning.component.scss']
})
export class LogoutWarningComponent implements OnInit {
  @ViewChild(IgxDialogComponent, { static: true }) public dialog: IgxDialogComponent;

  constructor(private authService: AuthService) { }

  public ngOnInit(): void {
    this.authService.openWarningDialog.subscribe(() => {
      this.dialog.open();
    });
  }

}
