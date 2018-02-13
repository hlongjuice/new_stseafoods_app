import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, ModalController, ViewController } from 'ionic-angular';
import { DateService } from "../../../../services/date.service";
import { EngBoilerService } from "../../../../services/eng/boiler.service";

/**
 * Generated class for the EngBoilerAddPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-eng-boiler-add',
  templateUrl: 'eng-boiler-add.html',
})
export class EngBoilerAddPage {

  _loader: any
  _toast: any
  _alert: any
  _submit_status: boolean;
  /* Date Time */
  date: any;
  real_time_record: any;
  time_records:any[];
  time_record:any;
  all_recorders: any;
  old_date: any;
  boiler_number: number
  ot_level:number
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
    this.boiler_number = this.navParams.data.boiler_number;
    this.date = this.dateService.getDate();
    this.real_time_record = this.dateService.getTime().currentTime
    //Remove already time
    this.all_recorders = this.navParams.data.all_recorders
    this.timeRecordFilter();
    console.log('all_recorders',this.all_recorders);
  }

  //getRecords
  getRecords() {
    console.log('inGet')
    let loader = this.loaderCtrl.create({ content: 'กำลังโหลดข้อมูล...' })
    loader.present();
    this.engBoilerService.getRecordByDate(this.date)
      .then((result: any) => {
        console.log(result)
        if (result.data) {
          this.all_recorders = result.data;
          this.timeRecordFilter();
        }
        loader.dismiss();
      }).catch(err => {
        console.log(err)
        this.showAlert(err)
        loader.dismiss();
      })
  }
  //setOilTank
  setOilTank(){
    for(let i=0;i<this.all_recorders.length;i++){
      if(this.all_recorders[i].time_record == this.time_record){
        this.ot_level=this.all_recorders[i].ot_level
        i=this.all_recorders.length
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
      for(let i=0;i<record.all_details.length;i++){//2 is total of boiler
        if(record.all_details[i].boiler_number == this.boiler_number){
          let index = this.time_records.indexOf(record.time_record)
          this.time_records.splice(index, 1)
          i=record.all_details.length;
        }
      }
    })
  }

  //Add Supply
  addRecord(formInputs, data) {
    this.old_date = this.date;
    this._submit_status = false
    formInputs.boiler_number = this.boiler_number
    console.log(formInputs);
    let loader = this.loaderCtrl.create({ content: 'กำลังโหลดข้อมูล...' })

    this.engBoilerService.addRecord(formInputs)
      .then(result => {
        this._submit_status = true
        //Update
        data.form.reset();
        setTimeout(() => {
          this.date = this.old_date
          loader.dismiss();
          this.showToast('การบันทึกเสร็จสมบูรณ์')
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
