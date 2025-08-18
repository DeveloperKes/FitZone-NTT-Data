import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService, UserService } from '../../../core/services';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'fz-login-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
  form: FormGroup;
  constructor(
    fb: FormBuilder,
    private readonly _userService: UserService,
    private readonly _router: Router,
    private readonly _alert: AlertService
  ) {
    this.form = fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9-_]+$/)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)]]
    });
  }

  login() {
    if (this.form.valid) {
      const loginData = this.form.value;
      this._userService.loginUser(loginData.username, loginData.password).subscribe({
        next: (user) => {
          this._userService.current = user.data;
          this.form.reset();
          this._router.navigate(["home"]);
        },
        error: (error) => {
          console.error('Login failed:', error);
          this._alert.openAlert({
            type: "toast",
            content: {
              title: "Valida tus credenciales e intenta nuevamente.",
              timer: 5000,
              toastType: "error"
            }
          })
        }
      });
      this.form.reset();
    } else {
      console.error('Form is invalid');
    }
  }
}
