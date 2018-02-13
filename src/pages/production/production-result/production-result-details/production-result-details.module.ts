import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductionResultDetailsPage } from './production-result-details';
import {PipesModule} from '../../../../pipes/pipes.module'

@NgModule({
  declarations: [
    ProductionResultDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductionResultDetailsPage),
    PipesModule
  ],
  exports: [
    ProductionResultDetailsPage
  ]
})
export class ProductionResultDetailsPageModule {}
