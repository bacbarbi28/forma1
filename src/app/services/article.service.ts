import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  serverTimestamp,
} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  constructor(private firestore: Firestore) {}

  createArticle(article: {
    title: string;
    imageUrl?: string;
    content: string;
  }): Promise<void> {
    const articlesRef = collection(this.firestore, 'articles');
    return addDoc(articlesRef, {
      ...article,
      createdAt: serverTimestamp(),
    }).then(() => {});
  }
}
