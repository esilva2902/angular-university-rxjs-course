import {Component, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {interval, Observable, of, timer} from 'rxjs';
import {catchError, delayWhen, map, retryWhen, shareReplay, tap} from 'rxjs/operators';

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
			map(res => Object.values(res['payload'])),
		 	shareReplay()
		);

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
