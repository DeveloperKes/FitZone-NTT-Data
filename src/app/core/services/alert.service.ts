import { Injectable, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';

export type AlertsType = "modal" | "actionsheet" | "toast";

export interface Alert {
  type: AlertsType;
  header?: {
    closeButton?: boolean;
    title?: string;
  };
  content?: {
    title: string;
    text?: string;
    buttons?: {
      cancel?: {
        text: string;
        onClick: VoidFunction;
      },
      confirm?: {
        text: string;
        onClick: VoidFunction;
      },
    },
    closeWithBackdrop?: boolean;
  },
  route?: any[]
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private readonly _open: WritableSignal<boolean> = signal(false);
  private readonly _config: WritableSignal<Alert | null> = signal(null);

  constructor(private readonly router: Router) { }

  openAlert(content: Alert) {
    this._config.set(content);
    if (content.route) {
      this.router.navigate([{ outlets: { modal: content.route } }])
    }
    this.open.set(true);
  }

  closeAlert() {
    this.open.set(false);
    this._config.set(null);
  }

  get open() {
    return this._open;
  }
  get config() {
    return this._config;
  }
}
