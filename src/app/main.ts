import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';

import { AppModule } from './app.module';

enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule);
