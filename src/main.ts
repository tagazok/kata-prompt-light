import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


import { Amplify } from 'aws-amplify';

import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
