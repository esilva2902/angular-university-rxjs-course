import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

export enum RxJSLoggingLevel {
  TRACE,
  DEBUG,
  INFO,
  ERROR
}

let rxjsLoggingLevel = RxJSLoggingLevel.INFO;

export function setRxJSLoggingLevel(level: RxJSLoggingLevel) {
  rxjsLoggingLevel = level;
}

/**
 * Custom operators must return a function.
 * A function which returns another function is
 * called Higher order function. 
 */
export const debug = (level: RxJSLoggingLevel, message: string) =>
  (source: Observable<any>) => source
    .pipe(
      tap(val => {
        if (level >= rxjsLoggingLevel) {
          console.log(`${message}: `, val);
        }
      })
    );