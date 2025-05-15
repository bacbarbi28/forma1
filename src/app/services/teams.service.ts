import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  deleteDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Team {
  id?: string;
  engine: string;
  teamName: string;
  drivers: string[];
  points: number;
  position: number;
  imageUrl: string;
  logoUrl: string;
  colorClass: string;
}

@Injectable({ providedIn: 'root' })
export class TeamsService {
  constructor(private firestore: Firestore) {}

  getTeams(): Observable<Team[]> {
    const teamsRef = collection(this.firestore, 'teams');
    const q = query(teamsRef, orderBy('position', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<Team[]>;
  }

  addTeam(team: Omit<Team, 'id'>): Promise<void> {
    const teamsRef = collection(this.firestore, 'teams');
    return addDoc(teamsRef, team).then(() => {});
  }

  updateTeam(id: string, team: Partial<Team>): Promise<void> {
    const teamRef = doc(this.firestore, 'teams', id);
    return updateDoc(teamRef, team);
  }

  deleteTeam(id: string): Promise<void> {
    const teamRef = doc(this.firestore, 'teams', id);
    return deleteDoc(teamRef);
  }
}
