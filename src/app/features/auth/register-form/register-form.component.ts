import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'fz-register-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss'
})
export class RegisterFormComponent {
  public form: FormGroup;
  constructor(
    fb: FormBuilder,
    private readonly _userService: UserService,
    private readonly _router: Router
  ) {
    this.form = fb.group({
      fullname: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9-_]+$/)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)]],
    })
  }

  registerUser() {
    if (this.form.valid) {
      const userData = this.form.value;
      this._userService.createUser(userData).subscribe({
        next: (user) => {
          this._userService.current = user.data;
          this.form.reset();
          this._router.navigate(["home"]);
        }
        , error: (error) => {
          console.error('Error creating user:', error);
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }
}
