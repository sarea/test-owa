import { enableProdMode, CompilerOptions } from '@angular/core';
import { BootstrapOptions } from '@angular/core/esm2015/src/application_ref';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import 'hammerjs';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

if (Office !== undefined) {
  // see: https://github.com/OfficeDev/office-js/issues/246#issuecomment-437260860
  Office.initialize = function () {
    // Does not throw. ever. see: https://github.com/OfficeDev/office-js/issues/246#issuecomment-438342679
    Office.onReady()
    .then((info: { host: Office.HostType, platform: Office.PlatformType }) => {
      // host and platform are correct, continue bootstrapping
      console.log(`starting add-in for environment: ${environment.OWA_URL} on host: ${info.host}, platform: ${info.platform}`);
      return bootStrapAngular();
    })
    .catch((reason) => {
      console.warn('Angular not bootstrapped. reason: \n');
      console.log(reason);
    });
  };
} else {
  bootStrapAngular();
}

function bootStrapAngular() {
  const compilerBootstrapOptions: CompilerOptions & BootstrapOptions = {
    preserveWhitespaces: false,
    ngZone: 'zone.js'
  };

  return platformBrowserDynamic().bootstrapModule(AppModule, compilerBootstrapOptions)
    .catch(error => {
    });
}
