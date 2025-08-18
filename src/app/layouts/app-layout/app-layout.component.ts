import { Component } from '@angular/core';
import { AlertsComponent, HeaderComponent } from '../../shared/components';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-app-layout',
  imports: [HeaderComponent, FooterComponent, RouterOutlet, AlertsComponent],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss'
})
export class AppLayoutComponent {

}
