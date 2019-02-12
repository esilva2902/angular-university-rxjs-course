import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { createHttpObservable } from '../common/util';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const http$ = createHttpObservable('/api/courses');

    http$.subscribe(response => {
      console.log(response);
    });
  }

}
