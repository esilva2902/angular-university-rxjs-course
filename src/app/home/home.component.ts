import {Component, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {interval, Observable, of, timer, throwError} from 'rxjs';
import {catchError, delayWhen, map, retryWhen, shareReplay, tap, finalize} from 'rxjs/operators';

import { createHttpObservable } from '../common/util';

@Component({
	selector: 'home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	private beginnersCourses$: Observable<any>;
	private advancedCourses$: Observable<any>;

	constructor() {

	}

	ngOnInit() {

		const http$: Observable<any> = createHttpObservable('/api/courses');

		const courses$ = http$.pipe(
			catchError(err => {
				console.log(`Error occurred: `, err);
				return throwError(err);
			}),
			finalize(() => {
				console.log('Finalize executed...');
			}),
			map(res => Object.values(res['payload'])),
			 shareReplay()
		);

		/**
		 * retryWhen() example
		 * 
		 * If there is an error, then wait for 2 seconds
		 * and retry again:
		 */
		// const courses$ = http$.pipe(
		// 	map(res => Object.values(res['payload'])),
		// 	 shareReplay(),
		// 	 retryWhen(errors => errors.pipe(
		// 		 delayWhen(() => timer(2000))
		// 	 ))
		// );

		this.beginnersCourses$ = courses$.pipe(
			map(courses => {
				return courses.filter((course: any) => course.category === 'BEGINNER');
			})
		);

		this.advancedCourses$ = courses$.pipe(
			map(courses => courses.filter((course: any) => course.category === 'ADVANCED'))
		);
	}

}
