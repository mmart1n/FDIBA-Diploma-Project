import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { take, exhaustMap, map, timeout } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
  constructor(
    private store: Store<fromApp.AppState>
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select('auth').pipe(
      take(1),
      map((authState) => {
        return authState.user;
      }),
      exhaustMap((user) => {
        if (!user) {
          return next.handle(request);
        }
        const modifiedRequest = request.clone({
          headers: request.headers.append('authorization', user.token),
        });
        return next.handle(modifiedRequest).pipe(timeout(30000));
      })
    );
  }
}
