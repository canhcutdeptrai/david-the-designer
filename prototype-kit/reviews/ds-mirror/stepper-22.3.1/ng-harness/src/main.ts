import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideSdIcon } from '@sdcorejs/angular/modules/icon';
import { SD_CORE_CONFIGURATION } from '@sdcorejs/angular/configurations';
import { StepperDemoComponent } from './app';
bootstrapApplication(StepperDemoComponent, { providers: [
  provideAnimations(),
  provideSdIcon({ defaultFontSet: 'material-icons-outlined' }),
  { provide: SD_CORE_CONFIGURATION, useValue: { language: 'vi' } },
] }).catch(e => console.error(e));
