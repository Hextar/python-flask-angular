import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {ExamsApiService} from './modules/exams-api.service';
import {Exam} from './modules/exam.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app';
  examsListSubs: Subscription;
  examsList: Exam[];

  constructor(private examsApi: ExamsApiService) {
  }

  ngOnInit() {
    this.examsListSubs = this.examsApi
      .getExams()
      .subscribe(res => {
          this.examsList = res;
        },
        console.error
      );
  }

  ngOnDestroy() {
    this.examsListSubs.unsubscribe();
  }
}