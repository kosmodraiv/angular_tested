import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpaceflightApiService {
  private apiKey = '95cab2cd25604073be92e04b52a3a76a';
  private baseUrl = 'https://newsapi.org/v2';

  constructor(private http: HttpClient) {}

  getArticles(): Observable<any[]> {
    const url = `${this.baseUrl}/top-headlines?country=us&apiKey=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map((data) => data.articles.slice(0, 15))
    );
  }

  getArticleById(articleId: string): Observable<any> {
    const url = `${this.baseUrl}/top-headlines?country=us&apiKey=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map((data) => data.articles[articleId])
    );
  }

  filterArticlesByKeyword(keyword: string): Observable<any[]> {
    return this.getArticles().pipe(
      map((articles) =>
        articles.filter(
          (article) =>
            article.title.toLowerCase().includes(keyword.toLowerCase()) ||
            article.description.toLowerCase().includes(keyword.toLowerCase())
        )
      )
    );
  }


}
