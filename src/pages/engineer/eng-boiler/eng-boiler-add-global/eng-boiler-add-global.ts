import { DateService } from './../../../../services/date.service';
import { EngBoilerService } from './../../../../services/eng/boiler.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, ModalController, ViewController } from 'ionic-angular';

/**
 * Generated class for the EngBoilerAddGlobalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-eng-boiler-add-global',
  templateUrl: 'eng-boiler-add-global.html',
})
export class EngBoilerAddGlobalPage {

  _loader: any
  _toast: any
  _alert: any
  _submit_status: boolean;
  /* Date Time */
  date: any;
  old_date: any;
  recorder:any;
  /* End Date Time */
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loaderCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public engBoilerService: EngBoilerService,
    public dateService: DateService
  ) {
  }

  ngOnInit() {
    this._submit_status = false;
    this.recorder=this.navParams.data.global_details;
    if(this.recorder==null){
      this.recorder={
        'date':null,
        'water_oil_start_time':'00:00:00',
        'water_oil_end_time':'00:00:00',
        'water_meter_start':null,
        'water_meter_end':null,
        'oil_meter_start':null,
        'oil_meter_end':null,
        'blow_down_number':null,
        'blow_down_sec':null,
        'blow_down_1_time':'00:00:00',
        'blow_down_2_time':'00:00:00',
        'safety_vale_time':'00:00:00'
      }
    }
    console.log(this.recorder)
    this.date = this.dateService.getDate();
  }

  //Add Supply
  addRecord(formInputs, data) {
    this.old_date = this.date;
    this._submit_status = false
    console.log(formInputs);
    let loader = this.loaderCtrl.create({ content: 'กำลังโหลดข้อมูล...' })

    this.engBoilerService.addGlobalDetails(formInputs)
      .then(result => {
        this._submit_status = true
        setTimeout(() => {
          this.date = this.old_date
          loader.dismiss();
          this.showToast('การบันทึกเสร็จสมบูรณ์')
          this.showToast('แก้ไขเสร็จสมบูรณ์')
          this.viewCtrl.dismiss(this._submit_status)
        }, 50)
        //End Update
      }).catch(err => {
        console.log(err)
        loader.dismiss()
        this.showAlert(err)
      })
    console.log('Next Step')
  }
  //Dismiss
  dismiss() {
    this.viewCtrl.dismiss(this._submit_status);
  }

  //Loader
  showLoader() {
    this._loader = this.loaderCtrl.create({ content: 'กำลังโหลดข้อมูล...' })
    this._loader.present()
  }
  //disMiss
  dismissLoader() {
    this._loader.dismiss()
  }
  //Alert
  showAlert(textInput) {
    this._alert = this.alertCtrl.create({ title: textInput })
    this._alert.present()
  }
  //Toast
  showToast(textInput) {
    this._toast = this.toastCtrl.create({ message: textInput, duration: 2000, position: 'top' })
    this._toast.present()
  }
}
