import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, User } from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  serverTimestamp,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  async register(
    fullName: string,
    email: string,
    password: string
  ): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    const user = userCredential.user;

    const userRef = doc(this.firestore, 'users', user.uid);
    await setDoc(userRef, {
      fullName,
      email,
      role: 'user',
      createdAt: serverTimestamp(),
    });

    return user;
  }
}
