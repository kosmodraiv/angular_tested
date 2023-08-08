import { Component, OnInit } from '@angular/core';
import { SpaceflightApiService } from '../spaceflight-api.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  articles: any[] = [];
  keyword: string = '';
  private searchKeyword$ = new Subject<string>();

  constructor(
    private spaceflightApiService: SpaceflightApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.spaceflightApiService.getArticles().subscribe(
      (data: any[]) => {
        this.articles = data.map((article: any, index: number) => ({ ...article, id: index.toString() }));
      },
      (error) => {
        console.error('Error fetching articles', error);
      }
    );
  }

  filterArticles() {
    const keywordLowercase = this.keyword.trim().toLowerCase();

    this.spaceflightApiService.getArticles().subscribe(
      (data: any[]) => {
        this.articles = data
          .map((article: any, index: number) => ({ ...article, id: index.toString() }))
          .filter((article) =>
            article.title.toLowerCase().includes(keywordLowercase) ||
            article.description.toLowerCase().includes(keywordLowercase)
          )
          .sort((a, b) => {
            const aTitleIncludesKeyword = a.title.toLowerCase().includes(keywordLowercase);
            const bTitleIncludesKeyword = b.title.toLowerCase().includes(keywordLowercase);
            const aDescriptionIncludesKeyword = a.description.toLowerCase().includes(keywordLowercase);
            const bDescriptionIncludesKeyword = b.description.toLowerCase().includes(keywordLowercase);

            if (aTitleIncludesKeyword && !bTitleIncludesKeyword) {
              return -1;
            } else if (!aTitleIncludesKeyword && bTitleIncludesKeyword) {
              return 1;
            } else if (aDescriptionIncludesKeyword && !bDescriptionIncludesKeyword) {
              return -1;
            } else if (!aDescriptionIncludesKeyword && bDescriptionIncludesKeyword) {
              return 1;
            } else {
              return a.title.localeCompare(b.title);
            }
          });
      },
      (error) => {
        console.error('Error fetching articles', error);
      }
    );
  }


  navigateToArticle(articleId: string) {
    this.router.navigate(['/article', articleId]);
  }

  highlightKeywords(text: string): string {
    if (!this.keyword.trim()) {
      return text;
    }

    const keywords = this.keyword.trim().split(' ');
    const pattern = new RegExp(keywords.join('|'), 'gi');

    return text.replace(pattern, (match) => `<span class="highlight">${match}</span>`);
  }
}
