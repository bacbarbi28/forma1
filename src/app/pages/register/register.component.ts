import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterService } from '../../services/register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  hidePassword = true;
  hideConfirm = true;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  async onRegister() {
    if (this.registerForm.valid) {
      const { fullName, email, password, confirmPassword } =
        this.registerForm.value;

      if (password !== confirmPassword) {
        alert('A két jelszó nem egyezik!');
        return;
      }

      try {
        await this.registerService.register(fullName, email, password);
        alert('Sikeres regisztráció!');
        window.location.href = '/login';
      } catch (error: any) {
        console.error('Regisztrációs hiba:', error);
        alert(error.message || 'Ismeretlen hiba történt');
      }
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
