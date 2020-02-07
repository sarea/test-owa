import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { EntryOnSendComponent } from './entries/entry-on-send/entry-on-send.component';


import {
    DialogService,
    EntryService,
} from '@@lib/services';
import { SendingService } from '@@lib/services/sending.service';
import { environment } from '../environments/environment';
import { OnSendLoadingComponent } from './pages/on-send-loading/on-send-loading.component';
import { AppComponent } from './app.component';
import { EntryComposeComponent } from './entries/entry-compose/entry-compose.component';
import { EntryReadComponent } from './entries/entry-read/entry-read.component';

// required for translations
export function createTranslateLoader (httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, '/v3/assets/i18n/', '.json');
}

export const APP_ROUTES: Routes = [
  {
    path: 'entry/compose',
    component: EntryComposeComponent,
  },
  {
    path: 'entry/read',
    component: EntryReadComponent,
  },
  {
    path: 'entry/on-send',
    component: EntryOnSendComponent,
  },
  {
    path: 'on-send-loading/:itemId',
    component: OnSendLoadingComponent,
  },
 ];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(APP_ROUTES, {
      enableTracing: false, // !environment.production,
      initialNavigation: 'enabled',
      useHash: true
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    !environment.production ? StoreDevtoolsModule.instrument({
      name: 'OWA'
    }) : [],
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    // angular material
    MatButtonModule,
  ],
  declarations: [
    // pages
    AppComponent,
    EntryComposeComponent,
    EntryOnSendComponent,
    EntryReadComponent,
    OnSendLoadingComponent,
  ],
  bootstrap: [AppComponent],
  providers: [
    DialogService,
    EntryService,
    SendingService,
    TranslateService,
  ],
})
export class AppModule {}
