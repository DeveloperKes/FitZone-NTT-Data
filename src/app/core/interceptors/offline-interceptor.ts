import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from "@angular/common/http";
import { FakeBackendService } from "../../../mocks/fake-db";
import { catchError, from, map, throwError } from "rxjs";

export const OfflineInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const fakeBackendService: FakeBackendService = new FakeBackendService();
    const url = req.url;
    const method = req.method;

    if (url.startsWith('/api/')) {
        return from(fakeBackendService.handleRequest(url, method, req.body)).pipe(
            map(response => new HttpResponse({ status: 200, body: response })),
            catchError(error => throwError(() => new HttpErrorResponse({ error: error.message, status: 404 })))
        );
    }

    return next(req);
}
