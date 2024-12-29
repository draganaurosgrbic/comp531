import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/app/constants';
import { Article } from './article';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(
    private http: HttpClient,
  ) { }

  createArticle(article: FormData) {
    return this.http.post<{ articles: Article[], totalCount: number }>(`${API_URL}/article`, article);
  }

  getArticles(page: number) {
    return this.http.get<{ articles: Article[], totalCount: number }>(`${API_URL}/articles?page=${page}`);
  }

  updateArticle(pid: number, text: string, page: number, commentId?: number) {
    return this.http.put<{ articles: Article[], totalCount: number }>(`${API_URL}/articles/${pid}?page=${page}`, { text, commentId });
  }

}
