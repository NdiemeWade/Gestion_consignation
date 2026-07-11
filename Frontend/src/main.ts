import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app'; //  On pointe sur le fichier app.ts et sa classe App

bootstrapApplication(App, appConfig) 
  .catch((err) => console.error(err));