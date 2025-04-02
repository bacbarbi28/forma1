import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TeamCardComponent } from '../../components/team-card/team-card.component';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [RouterModule, TeamCardComponent],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss',
})
export class TeamsComponent {}
