import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, ModalController } from 'ionic-angular';
import { DateService } from "../../../services/date.service";
import { EngBoilerService } from "../../../services/eng/boiler.service";
import { AuthService } from '../../../services/auth.service';

/**
 * Generated class for the EngBoilerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-eng-boiler',
  templateUrl: 'eng-boiler.html',
})
export class EngBoilerPage {

  _loader: any;
  _alert: any;
  _toast: any;

  date: any;
  month: any;
  year: any;
  all_results:any;
  recorders: any;
  time_records: any[];
  daily_used: any;
  yesterday_meter: any;
  result_date: any;
  user_types: any;
  user: any;
  isHighlightVisible: boolean[];
  groupTab: any;
  test:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public engBoilerService: EngBoilerService,
    public loaderCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public dateService: DateService,
    public authService: AuthService
  ) {
  }

  //ngOnInit
  ngOnInit() {
    this.test=Date.now().toString();
    console.log(this.test);
    this.groupTab='boiler_1';
    this.isHighlightVisible = [];
    this.isHighlightVisible[0] = true;
    this.authService.getUserDetails()
      .then(result => {
        this.user = result
        this.user_types = this.authService.getUserTypes();
        this.daily_used = [];
        this.date = this.dateService.getDate();
        this.month = this.dateService.getCurrentDateTime().MM;
        this.year = this.dateService.getCurrentDateTime().YY;
        this.getRecords();
      });
  }
  //Set Hilight
  setHighlight(i) {
    this.isHighlightVisible.fill(false);
    this.isHighlightVisible[i] = true;
    console.log(this.isHighlightVisible);
  }
  //Get Supply
  getRecords() {
    this.showLoader()
    this.engBoilerService.getRecordByDate(this.date)
      .then((result: any) => {
        console.log(result)
        this.all_results = result;
        if (result.data) {
          this.setBoiler();
        } else {
          this.recorders = [];
        }
        this.result_date = result.date;
        this.yesterday_meter = result.yesterday_meter
        this.daily_used = result;
        this.dismissLoader()
      }).catch(err => {
        console.log(err)
        this.showAlert(err)
        this.dismissLoader();
      })

  }
    //Set  Boiler
    setBoiler() {
      if(this.groupTab=='boiler_1'){
        this.recorders=this.all_results.boiler_1;
      }else if(this.groupTab=='boiler_2'){
        this.recorders=this.all_results.boiler_2;
      }
    }
  //Add Supply
  addRecord(boiler_number: number) {
    let modal = this.modalCtrl.create('EngBoilerAddPage', {
      'all_recorders': this.all_results.data,
      'boiler_number': boiler_number
    }, { enableBackdropDismiss: false })
    modal.present()
    modal.onDidDismiss(result => {
      if (result) {
        this.getRecords();
      }
    })
  }
    //Add Supply
    addGlobalDetails() {
      let modal = this.modalCtrl.create('EngBoilerAddGlobalPage', {
        'global_details':this.all_results.global_details
      }, { enableBackdropDismiss: false })
      modal.present()
      modal.onDidDismiss(result => {
        if (result) {
          this.getRecords();
        }
      })
    }
  //Edit Supply
  editRecord(recorder_input) {
    let recorder = Object.create(recorder_input);
    let modal = this.modalCtrl.create('EngBoilerEditPage', {
      'all_recorders': this.all_results.data,
      'recorder': recorder,
      'date':this.all_results.date
    }, { enableBackdropDismiss: false })
    modal.present();
    modal.onDidDismiss(result => {
      if (result) {
        this.getRecords();
      }
    })
  }
  //Delete Supply
  deleteRecord(recorder) {
    let confirm = this.alertCtrl.create({
      title: 'ยืนยันการลบ',
      buttons: [
        {
          text: 'ยกเลิก',
          role: 'cancel',
          cssClass: 'alertCancel'
        },
        {
          text: 'ยืนยัน',
          handler: () => {
            this.showLoader();
            this.engBoilerService.deleteRecord(recorder.details.id)
              .then(result => {
                console.log('Delete Result',result)
                this.dismissLoader();
                this.getRecords();
                this.showToast('ลบข้อมูลเสร็จสิ้น')
              }).catch(err => { this.dismissLoader(); this.showAlert(err); })
          },
          cssClass: 'alertConfirm'
        }
      ]
    })
    confirm.present();
  }
  //OpenPage
  openPage(page: any) {
    this.navCtrl.setRoot(page);
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
