import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, ModalController, ViewController } from 'ionic-angular';
import { Eng_5x7HighTankService } from '../../../../services/eng/_5x7-high-tank.service';

/**
 * Generated class for the Eng_5x7HighTankEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-eng-5x7-high-tank-edit',
  templateUrl: 'eng-5x7-high-tank-edit.html',
})
export class Eng_5x7HighTankEditPage {

  _loader: any
  _toast: any
  _alert: any
  _submit_status: boolean;
  time_records: any[];
  all_recorders: any;
  recorder: any;
  date: any;
  count: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loaderCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public eng_5x7HighTankService: Eng_5x7HighTankService
  ) {
  }

  ngOnInit() {
    this.count = 0;
    console.log('will Enter')
    this.time_records = [];
    for (let i = 1; i <= 24; i++) {
      this.time_records.push(i + ':00')
    }
    this._submit_status = false;

    this.recorder = this.navParams.data.recorder;
    this.all_recorders = this.navParams.data.all_recorders
    //Remove already time
    this.all_recorders = this.navParams.data.all_recorders
    this.all_recorders.forEach(record => {
      if (record.time_record != this.recorder.time_record) {
        let index = this.time_records.indexOf(record.time_record)
        this.time_records.splice(index, 1)
      }
    })
    this.date = this.recorder.date;
  }
  //getRecords
  getRecords() {
    console.log(this.date);
    if (this.count > 0) {
      console.log('In get Records')
      this.showLoader()
      console.log()
      this.eng_5x7HighTankService.getRecordByDate(this.date)
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

  //Time Record Filter
  timeRecordFilter() {
    this.time_records = [];
    for (let i = 1; i <= 24; i++) {
      this.time_records.push(i + ':00')
    }
    //Remove already time
    this.all_recorders.forEach(record => {
      let index = this.time_records.indexOf(record.time_record)
      this.time_records.splice(index, 1)
    })
  }

  //Update Supply
  updateRecord(formInputs) {
    formInputs.id = this.recorder.id;
    this.showLoader()
    this.eng_5x7HighTankService.updateRecord(formInputs)
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
