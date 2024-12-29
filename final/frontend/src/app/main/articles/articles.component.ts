import { Component, OnInit } from '@angular/core';
import { ArticlesService } from './articles.service';
import { Article } from './article';
import { ARTICLES_PAGE_SIZE } from 'src/app/constants';
import { ProfileService } from 'src/app/profile/profile.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {

  constructor(
    private profileService: ProfileService,
    private articlesService: ArticlesService,
  ) { };

  page = 0;
  pageCount!: number;

  articles!: Article[];
  filteredArticles!: Article[];

  username!: string;

  commentsShowedMap: { [key: number]: boolean } = {};

  ngOnInit() {
    this.getArticles();
    this.profileService.getField('headline').subscribe(res => this.username = res.username);
  }

  commentsShowed(article: Article) {
    return this.commentsShowedMap[article.pid];
  }

  toggleCommentsShowed(article: Article) {
    this.commentsShowedMap[article.pid] = !this.commentsShowedMap[article.pid];
  }

  private setArticles(res: { articles: Article[], totalCount: number }) {
    this.articles = res.articles;
    this.pageCount = Math.ceil(res.totalCount / ARTICLES_PAGE_SIZE);
    this.filteredArticles = this.articles;
  }

  getArticles() {
    this.articlesService.getArticles(this.page).subscribe(res => this.setArticles(res));
  }

  changePage(direction: number) {
    this.page += direction;
    this.getArticles();
  }

  createArticle(text: string, image: any) {
    if (!text.trim()) {
      return;
    }
    const article = new FormData();
    article.append('text', text);
    if (image) {
      article.append('image', image);
    }
    this.articlesService.createArticle(article).subscribe(res => this.setArticles(res));
  }

  updateArticle(pid: number, text: string, commentId?: number) {
    if (!text.trim()) {
      return;
    }
    this.articlesService.updateArticle(pid, text, this.page, commentId).subscribe(res => this.setArticles(res));
  }

  filterArticles(text: string) {
    text = text.trim().toLowerCase();
    this.filteredArticles = this.articles.filter(article =>
      article.author.trim().toLowerCase().includes(text)
      || article.text.trim().toLowerCase().includes(text));
  }

}
