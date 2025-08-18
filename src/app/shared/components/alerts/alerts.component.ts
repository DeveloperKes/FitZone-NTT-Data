import { Component, effect, Type } from '@angular/core';
import { ModalComponent } from './modal/modal.component';
import { ToastComponent } from './toast/toast.component';
import { ActionSheetComponent } from './action-sheet/action-sheet.component';
import { AlertService, AlertsType } from '../../../core/services';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'fz-alerts',
  imports: [NgComponentOutlet],
  template: `
   <ng-container *ngComponentOutlet="currentAlert"></ng-container>
  `,
  styles: ``
})
export class AlertsComponent {
  alertType: AlertsType | null = null;
  constructor(
    public readonly _alert: AlertService
  ) {
    effect(() => {
      this.alertType = _alert.config()?.type ?? null;
    })
  }

  get currentAlert(): Type<any> | null {
    if (this.alertType == "actionsheet") return ActionSheetComponent;
    if (this.alertType == "toast") return ToastComponent;
    if (this.alertType == "modal") return ModalComponent;
    return null
  }
}
