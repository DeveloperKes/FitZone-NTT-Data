import { Component, effect, ElementRef, ViewChild } from '@angular/core';
import { Alert, AlertService } from '../../../../core/services';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'fz-modal',
  imports: [RouterOutlet],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @ViewChild('dialogModal', { static: true }) dialogRef!: ElementRef<HTMLDialogElement>;
  data!: Alert;
  constructor(private readonly _alert: AlertService) {
    effect(() => {
      const dialog = this.dialogRef.nativeElement;
      const alertData = _alert.config();
      if (alertData != null) this.data = alertData;

      if (this._alert.open()) {
        dialog.showModal();
        dialog.classList.add("open");
      } else {
        dialog.close();
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

  closeModal() {
    const dialog = this.dialogRef.nativeElement;
    dialog.classList.add("close");
    setTimeout(() => {
      this._alert.closeAlert();
    }, 500)
  }
}
