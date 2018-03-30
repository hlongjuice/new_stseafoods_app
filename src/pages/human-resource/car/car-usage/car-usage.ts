import { DateService } from './../../../../services/date.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, PopoverController } from 'ionic-angular';
import { CarUsageService } from "../../../../services/human-resource/car/car-usage.service";

/**
 * Generated class for the CarUsagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-car-usage',
  templateUrl: 'car-usage.html',
})
export class CarUsagePage {

  carUsages: any[];
  totalUsage: any;
  month: any;
  year: any;
  car: any;
  groupTab:any;
  date:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loaderCtrl: LoadingController,
    public carUsageService: CarUsageService,
    public dateService: DateService,
    public popCtrl: PopoverController,
    public loader:LoadingController
  ) {

  }

  ngOnInit() {
    let loader=this.loaderCtrl.create({content:'กำลังโหลดข้อมูล...'})
    this.date=this.dateService.getDate();
    this.groupTab='monthly';
    loader.present()
    this.car = this.navParams.data.car;
    console.log(this.car)
    this.month = this.dateService.getCurrentDateTime().MM;
    this.year = this.dateService.getCurrentDateTime().YY;
    this.carUsageService.getByMonth(this.car.id, this.year, this.month)
      .then(result => {
        this.calculateUsage(result)
        loader.dismiss();

      }).catch(err => { console.log(err);loader.dismiss() })
  }
  //ClearData
  clearData(){
    this.carUsages=[];
    this.totalUsage={};
    console.log('Clear Data CarUsage : ',this.carUsages);
  }
  //Get By Month
  getByMonth(){
    let loader=this.loaderCtrl.create({content:'กำลังโหลดข้อมูล...'})
    let date = new Date(this.date)
    this.year = date.getFullYear();
    this.month=date.getMonth()+1;
    loader.present()
    this.carUsageService.getByMonth(this.car.id, this.year, this.month)
    .then(result => {
      this.calculateUsage(result)
      loader.dismiss();
    }).catch(err => { console.log(err);loader.dismiss() })
  }
  //Get By Yeat
  getByYear(){
    let loader=this.loaderCtrl.create({content:'กำลังโหลดข้อมูล...'})
    loader.present()
    let date = new Date(this.date)
    this.year = date.getFullYear();
    this.carUsageService.getByYear(this.car.id, this.year)
    .then(result => {
      this.calculateUsage(result)
      loader.dismiss();
    }).catch(err => { console.log(err);loader.dismiss() })
  }
  //Calculate Usage
  calculateUsage(result){
    let totalResult = {
      distance: 0,
      gas_fill: 0,
      gas_unit_price: 0,
      gas_total_price: 0,
      distance_per_litre: 0,
      price_per_distance: 0
    }
    this.carUsages = result;
    let carUsageLength = this.carUsages.length;

    this.carUsages.forEach(carUsage => {
      // console.log(carUsage)
      totalResult.distance =totalResult.distance+parseInt(carUsage.distance);
      totalResult.gas_fill += parseFloat(carUsage.gas_fill) ;
      totalResult.gas_unit_price += parseFloat(carUsage.gas_unit_price);
      totalResult.distance_per_litre += parseFloat(carUsage.distance_per_litre);
      totalResult.price_per_distance += parseFloat (carUsage.price_per_distance);
      totalResult.gas_total_price += parseFloat(carUsage.gas_total_price);
    });
    totalResult.distance_per_litre = totalResult.distance_per_litre /carUsageLength;
    totalResult.gas_unit_price = totalResult.gas_unit_price / carUsageLength;
    totalResult.price_per_distance = totalResult.price_per_distance / carUsageLength
    this.totalUsage=totalResult;
    console.log(this.totalUsage)
    console.log(totalResult);
  }

  /* More Details */
  moreDetails(details, myEvent) {
    let popUp = this.popCtrl.create('MoreCarUsageDetailsPage', {
      'carUsage': details
    })
    popUp.present({
      ev: myEvent
    });
  }


}
