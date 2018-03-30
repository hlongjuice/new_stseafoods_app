import { CarManageService } from './../../../../../services/human-resource/car/car-manage.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';

/**
 * Generated class for the CarEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-car-edit',
  templateUrl: 'car-edit.html',
})
export class CarEditPage {

  quantity=0;
  carTypes: any[];
  updateStatus:boolean;
  car:any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl:ViewController,
    public loaderCtr:LoadingController,
    public carManageService:CarManageService,
    public alertCtrl:AlertController
  ) {
  }

  ngOnInit() {
    this.car={};
    this.updateStatus=false;
    this.carTypes = [];
    this.carTypes=this.navParams.data.carTypes;
    this.car=this.navParams.data.car;
    console.log('NavParams',this.navParams)
  }

  /*Add Car*/
  updateCar(newCar){
    let loader=this.loaderCtr.create({
      content:'กำลังอัพโหลด'
    })
    let errAlert=this.alertCtrl.create({
      title:'ไม่สามารถเพิ่มข้อมูลได้ ลองใหม่อีกครั้ง'
    })
    loader.present();
    console.log(newCar.value)
    this.carManageService.updateCar(this.car.id,newCar.value.car_number,newCar.value.selectedCarType,
    newCar.value.plate_number)
    .then(
      result=>{
        loader.dismiss();
        this.updateStatus=true;
        this.viewCtrl.dismiss(this.updateStatus);
      }
    ).catch(
     err=>{
       loader.dismiss();
       errAlert.present();
     } 
    )
  }

  /*Closed Modal*/
  closed(){
    this.viewCtrl.dismiss(this.updateStatus);
  }
  /*Get Car Type*/
  getTypes(){
    if(this.carTypes.length<1){
      this.carManageService.getCarType()
      .then(result=>this.carTypes=result)
      .catch(err=>{console.log(err)})
    }
  }

}
