import { Component, effect, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Alert, AlertService } from '../../../../core/services';

@Component({
  selector: 'fz-toast',
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  @ViewChild('dialogToast', { static: true }) dialogRef!: ElementRef<HTMLDialogElement>;
  data!: Alert;

  private timeout: any;
  constructor(private readonly _alert: AlertService) {
    effect(() => {
      if (this.timeout) clearTimeout(this.timeout);
      const dialog = this.dialogRef.nativeElement;
      const alertData = _alert.config();
      if (alertData != null) this.data = alertData;

      if (this._alert.open()) {
        dialog.show();
        dialog.classList.add("open");

        if (this.data?.content?.timer) {
          const timer = this.data.content.timer;
          this.timeout = setTimeout(() => {
            this.closeToast();
          }, (timer > 500 ? timer - 500 : timer))
        }
      } else {
        this.closeToast();
      }

      dialog.addEventListener("cancel", (e) => {
        e.preventDefault();
        dialog.classList.add("close");
        setTimeout(() => {
          _alert.closeAlert();
        }, 500)
      })
    })
  }

  closeToast() {
    const dialog = this.dialogRef.nativeElement;
    dialog.classList.add("close");
    setTimeout(() => {
      this._alert.closeAlert();
    }, 500)
  }
}
