import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/core/app.config';
import { AppComponent } from './app/app.component';
import { setupFakeBackend } from './mocks/setupFakeBackend';
import { registerLocaleData } from '@angular/common';

import localeEsCO from '@angular/common/locales/es-CO';

(async () => {
  await setupFakeBackend();
})();

registerLocaleData(localeEsCO, 'es-CO');

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
