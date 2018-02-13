import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductionWorkFormPage } from './production-work-form';
import {PipesModule} from '../../../pipes/pipes.module'
@NgModule({
  declarations: [
    ProductionWorkFormPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductionWorkFormPage),
    PipesModule
  ],
  exports: [
    ProductionWorkFormPage
  ]
})
export class ProductionWorkFormPageModule {}
