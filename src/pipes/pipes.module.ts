import { NgModule } from '@angular/core';
import { LastFourEmIdPipe } from './last-four-em-id/last-four-em-id';
import { MyDatePipe } from './my-date/my-date';
@NgModule({
	declarations: [
		LastFourEmIdPipe,
    MyDatePipe,
	],
	imports: [],
	exports: [
		LastFourEmIdPipe,
    MyDatePipe,
	]
})
export class PipesModule { }
