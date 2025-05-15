import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TeamCardComponent } from '../../components/team-card/team-card.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TeamsService, Team } from '../../services/teams.service';
import { Observable, take } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { TeamDialogComponent } from '../../components/team-dialog/team-dialog.component';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [
    RouterModule,
    TeamCardComponent,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
})
export class TeamsComponent implements OnInit {
  teams$: Observable<Team[]>;
  role$!: Observable<string | null>;

  private dialog = inject(MatDialog);
  private snackbar = inject(MatSnackBar);

  constructor(
    private teamsService: TeamsService,
    private authService: AuthService
  ) {
    this.teams$ = this.teamsService.getTeams();
    this.role$ = this.authService.role$;
  }

  ngOnInit(): void {}

  openAddDialog(): void {
    const dialogRef = this.dialog.open(TeamDialogComponent, {
      width: '100%',
      maxWidth: '600px',
      data: null,
    });

    dialogRef.afterClosed().subscribe((data: Team | null) => {
      if (data) {
        this.teamsService.addTeam(data).then(() => {
          this.snackbar.open('Csapat hozzáadva.', 'Bezárás', {
            duration: 3000,
          });
        });
      }
    });
  }

  openEditDialog(team: Team): void {
    const dialogRef = this.dialog.open(TeamDialogComponent, {
      width: '90%',
      maxWidth: '600px',
      data: team,
    });

    dialogRef.afterClosed().subscribe((updatedTeam: Team | null) => {
      if (updatedTeam && updatedTeam.id) {
        this.teamsService.updateTeam(updatedTeam.id, updatedTeam).then(() => {
          this.snackbar.open('Csapat frissítve.', 'Bezárás', {
            duration: 3000,
          });
        });
      }
    });
  }

  deleteTeam(team: Team): void {
    if (team.id) {
      const confirmed = confirm(
        `Biztosan törölni szeretnéd a(z) ${team.teamName} csapatot?`
      );
      if (confirmed) {
        this.teamsService.deleteTeam(team.id).then(() => {
          this.snackbar.open('Csapat törölve.', 'Bezárás', {
            duration: 3000,
          });
        });
      }
      return;
    }

    this.teams$.pipe(take(1)).subscribe((teams) => {
      const match = teams.find(
        (t) =>
          t.engine === team.engine &&
          t.teamName === team.teamName &&
          JSON.stringify(t.drivers) === JSON.stringify(team.drivers)
      );

      if (match && match.id) {
        const confirmed = confirm(
          `Biztosan törölni szeretnéd a(z) ${match.teamName} csapatot?`
        );
        if (confirmed) {
          this.teamsService.deleteTeam(match.id).then(() => {
            this.snackbar.open('Csapat törölve.', 'Bezárás', {
              duration: 3000,
            });
          });
        }
      } else {
        this.snackbar.open('Nem található törölhető csapat.', 'Bezárás', {
          duration: 3000,
        });
      }
    });
  }
}
