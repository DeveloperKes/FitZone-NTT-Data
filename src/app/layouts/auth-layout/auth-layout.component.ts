import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertsComponent } from '../../shared/components';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, AlertsComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {

}
