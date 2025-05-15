import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatToolbarModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    CommonModule,
    MatMenuModule,
    MatIcon,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'forma1';

  user$: Observable<User | null>;
  role$: Observable<string | null>;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.user$;
    this.role$ = this.authService.role$;
  }

  logout(): void {
    this.authService.logout();
  }
}
