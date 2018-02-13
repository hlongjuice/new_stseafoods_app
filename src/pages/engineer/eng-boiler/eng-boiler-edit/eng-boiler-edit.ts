import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, ModalController, ViewController } from 'ionic-angular';
import { EngBoilerService } from "../../../../services/eng/boiler.service";

/**
 * Generated class for the EngBoilerEditPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-eng-boiler-edit',
  templateUrl: 'eng-boiler-edit.html',
})
export class EngBoilerEditPage {

  _loader: any
  _toast: any
  _alert: any
  _submit_status: boolean;
  time_records: any[];
  time_record:any;
  all_recorders: any;
  count: any;
  date: any;
  recorder: any;
  boiler_number:number;
  ot_level:number;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loaderCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public engBoilerService: EngBoilerService
  ) {
  }

  ngOnInit() {
    this.count = 0;
    this._submit_status = false;
    this.recorder = this.navParams.data.recorder;
    console.log(this.recorder);
    this.date = this.navParams.data.date;
    this.boiler_number = this.recorder.details.boiler_number
    console.log('boiler_number',this.boiler_number);
    this.ot_level=this.recorder.ot_level
    //Remove already time
    this.all_recorders = this.navParams.data.all_recorders
    this.time_record=this.recorder.time_record;
    this.timeRecordFilter();
    console.log('Time_record',this.time_record);
  }

  //getRecords
  getRecords() {
    console.log(this.date);
    if (this.count > 0) {
      console.log('In get Records')
      this.showLoader()
      console.log()
      this.engBoilerService.getRecordByDate(this.date)
        .then((result: any) => {
          console.log(result)
          this.all_recorders = result.data;
          this.timeRecordFilter();
          this.dismissLoader()
        }).catch(err => {
          console.log(err)
          this.showAlert(err)
          this.dismissLoader();
        })
    }
    this.count++;
  }

  //setOilTank
  setOilTank() {
    console.log(this.time_record);
    for (let i = 0; i < this.all_recorders.length; i++) {
      if (this.all_recorders[i].time_record == this.time_record) {
        this.ot_level = this.all_recorders[i].ot_level
        i = this.all_recorders.length
      }
    }
  }

  //Time Record Filter
  timeRecordFilter() {
    this.time_records = [];
    for (let i = 1; i <= 24; i++) {
      this.time_records.push(i + ':00')
    }
    //Remove already time
    this.all_recorders.forEach(record => {
      for (let i = 0; i < record.all_details.length; i++) {//2 is total of boiler
        if (record.all_details[i].boiler_number == this.boiler_number) {
          console.log('record.time_record',record.time_record)
          console.log('this.time_record',this.time_record)
          if(this.time_record!=record.time_record){//except self time_record
            let index = this.time_records.indexOf(record.time_record)
            this.time_records.splice(index, 1)
            i = record.all_details.length;
          }
        }
      }
    })
  }

  //Update Supply
  updateRecord(formInputs) {
    formInputs.id = this.recorder.details.id;
    this.showLoader()
    console.log('formInputs',formInputs)
    this.engBoilerService.updateRecord(formInputs)
      .then(result => {
        this._submit_status = true;
        this.dismissLoader();
        this.showToast('แก้ไขเสร็จสมบูรณ์')
        this.viewCtrl.dismiss(this._submit_status)
      }).catch(err => {
        console.log(err)
        this.dismissLoader();
        this.showAlert(err)
      })
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
  //disMiss Loader
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
