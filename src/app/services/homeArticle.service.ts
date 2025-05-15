import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  query,
  orderBy,
  Timestamp,
  doc,
  getDoc,
} from '@angular/fire/firestore';
import { Observable, map, from } from 'rxjs';

export interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: Timestamp;
}

@Injectable({ providedIn: 'root' })
export class HomeArticleService {
  constructor(private firestore: Firestore) {}

  getArticles(): Observable<Article[]> {
    const articlesRef = collection(this.firestore, 'articles');
    const q = query(articlesRef, orderBy('createdAt', 'desc'));

    return collectionData(q, { idField: 'id' }).pipe(
      map((articles: any[]) =>
        articles.map((article) => ({
          ...article,
          content: this.truncateContent(article.content),
        }))
      )
    );
  }

  private truncateContent(content: string): string {
    const firstSentenceEnd = content.indexOf('.');
    return firstSentenceEnd !== -1
      ? content.slice(0, firstSentenceEnd + 1)
      : content;
  }

  getArticleById(id: string): Observable<Article | null> {
    const docRef = doc(this.firestore, 'articles', id);
    return from(getDoc(docRef)).pipe(
      map((snap) => {
        const data = snap.data();
        return data
          ? {
              ...(data as Article),
              id: snap.id,
              content: data['content'],
            }
          : null;
      })
    );
  }
}
