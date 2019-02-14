import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { tap, map } from "rxjs/operators";

import { Course } from "../model/course";
import { createHttpObservable } from "./util";

@Injectable({
  providedIn: 'root'
})
export class Store {
  
  private subject = new BehaviorSubject<Course[]>([ ]);
  public courses$: Observable<Course[]> = this.subject.asObservable();

  public init() {
    const http$ = createHttpObservable('/api/courses');

    http$
      .pipe(
          tap(() => console.log("HTTP request executed")),
          map(res => Object.values(res["payload"] as Course[]))
      )
      .subscribe(courses => this.subject.next(courses));
  }

  public selectBeginnerCourses(): Observable<Course[]> {
    return this.filterByCategory('BEGINNER');
  }

  public selectAdvancedCourses(): Observable<Course[]> {
    return this.filterByCategory('ADVANCED');
  }

  public filterByCategory(category: string): Observable<Course[]> {
    return this.courses$
      .pipe(
          map(courses => courses
            .filter(course => course.category == 'BEGINNER'))
      );
  }
}