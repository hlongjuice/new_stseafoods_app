import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the LastFourEmIdPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'lastFourEmId',
})
export class LastFourEmIdPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: any, ...args) {
    let emID='';
    if(typeof value !== "string"){
      emID=String(value).slice(-4);
    }else{
      emID=value.slice(-4)
    }
    return emID;
  }
}
