import {Injectable} from '@angular/core';

@Injectable()
export class WebUrlService{
    public url:string
    constructor(
        // private url:string
    ){
        // this.url='http://www.ggeverything.com/public'; 
        // this.url='http://www.ggeverything.com';
        // this.url='http://192.168.43.241/stseafood/public';
        this.url='http://192.168.1.114/stseafood/public';
        // this.url='http://192.168.1.104/stseafood/public';
        //Factory IP
        // this.url='http://192.168.2.13:8100/stseafood/public';
        //End Factory IP
        // this.url='http://192.168.1.149/stseafood/public';
    }
    getUrl(){
        return this.url;
    }
}