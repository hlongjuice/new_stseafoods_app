import {Injectable} from '@angular/core';

@Injectable()
export class WebUrlService{
    public url:string
    constructor(
        // private url:string
    ){
        // this.url='http://192.168.43.241/stseafood/public';
        // this.url='http://127.0.0.1/stseafood/public';
        //Factory IP
        this.url='http://192.168.2.13:8100/stseafood/public';
        //End Factory IP
    }
    getUrl(){
        return this.url;
    }
}