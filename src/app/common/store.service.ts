import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { tap, map, filter } from "rxjs/operators";
import { fromPromise } from "rxjs/internal-compatibility";

import { Course } from "../model/course";
import { createHttpObservable } from "./util";

@Injectable({
  providedIn: 'root'
})
export class Store {
  
  private subject = new BehaviorSubject<Course[]>([]);
  public courses$: Observable<Course[]> = this.subject.asObservable();

  public init() {
    const http$ = createHttpObservable('/api/courses');

    http$
      .pipe(
          tap(() => console.log("HTTP request executed")),
          map(res => Object.values(res["payload"] as Course[])),
          tap(courses => console.log(`Courses retrieved: `, courses))
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
            .filter(course => course.category === category))
      );
  }

  public selectCourseById(courseId: number): Observable<Course> {
    console.log(`selectCourseById ==> courseId: ${courseId}`);
    return this.courses$
      .pipe(
          map(courses => courses.find(course => course.id === courseId)),
          // filter(course => !!course)
      );
  }

  public saveCourse(courseId: number, changes: any) {
    // Firstly, change the course in memory:
    const courses: Course[] = this.subject.getValue();
    const courseIndex: number = courses.findIndex(course => course.id === courseId);

    // Create a new instance of courses array:
    const newCourses = courses.splice(0);

    // Replace the course with new values:
    newCourses[ courseIndex ] = {
      ...courses[ courseIndex ],
      ...changes
    };

    // Broadcast the new courses (with the new course as courseIndex):
    this.subject.next(newCourses);

    return fromPromise(fetch(`/api/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(changes),
      headers: {
        'content-type': 'application/json'
      }
    }));

  }
}