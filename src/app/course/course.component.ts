import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat} from 'rxjs';

import { Course } from "../model/course";
import { Lesson } from './../model/lesson';

import { createHttpObservable } from '../common/util';
import { debug, RxJSLoggingLevel, setRxJSLoggingLevel } from '../common/debug';

@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

	private courseId: string;

	private course$: Observable<Course>;
	private lessons$: Observable<Lesson[]>;

	@ViewChild('searchInput') input: ElementRef;

	constructor(private route: ActivatedRoute) {


	}

	ngOnInit() {
		this.courseId = this.route.snapshot.params['id'];

		this.course$ = createHttpObservable(`/api/courses/${this.courseId}`)
			.pipe(
				debug(RxJSLoggingLevel.TRACE, 'course value')
			);

		setRxJSLoggingLevel(RxJSLoggingLevel.DEBUG);
	}

	ngAfterViewInit() {
		this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
			.pipe(
				map(event => event.target.value),
				startWith(''),
				debug(RxJSLoggingLevel.INFO, 'search'),
				debounceTime(400),
				distinctUntilChanged(),
				switchMap(search => this.loadLessons(search)),
				debug(RxJSLoggingLevel.DEBUG, 'lessons value')
			);
	}

	loadLessons(search = ''): Observable<Lesson[]> {
		return createHttpObservable(`api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
			.pipe(
				map(res => res['payload'])
			);
	}



}
