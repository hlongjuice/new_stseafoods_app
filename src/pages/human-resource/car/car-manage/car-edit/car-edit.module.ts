import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CarEditPage } from './car-edit';

@NgModule({
  declarations: [
    CarEditPage,
  ],
  imports: [
    IonicPageModule.forChild(CarEditPage),
  ],
})
export class CarEditPageModule {}
