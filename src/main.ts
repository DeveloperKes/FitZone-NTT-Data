import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/core/app.config';
import { AppComponent } from './app/app.component';
import { setupFakeBackend } from './mocks/setupFakeBackend';

(async () => {
  await setupFakeBackend();
})();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
