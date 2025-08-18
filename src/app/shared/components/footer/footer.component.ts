import { Component, effect } from '@angular/core';
import { ImageComponent } from '../../elements';
import { UserService } from '../../../core/services';

@Component({
  selector: 'fz-footer',
  imports: [ImageComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  hasUser: boolean = false;
  constructor(
    private readonly _user: UserService,
  ) {
    effect(() => {
      this.hasUser = !!_user.current;
    })
  }
}
