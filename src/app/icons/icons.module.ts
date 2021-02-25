import { allIcons } from 'angular-feather/icons';
import { FeatherModule } from 'angular-feather';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    FeatherModule.pick(allIcons)
  ],
  exports: [
    FeatherModule
  ]
})
export class IconsModule { }