import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/components';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-app-layout',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss'
})
export class AppLayoutComponent {

}
