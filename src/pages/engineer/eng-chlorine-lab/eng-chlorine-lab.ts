import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, ModalController } from 'ionic-angular';
import { DateService } from "../../../services/date.service";
import { EngChlorineLabService } from "../../../services/eng/chlorine-lab.service";
import { AuthService } from '../../../services/auth.service';

/**
 * Generated class for the EngChlorineLabPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-eng-chlorine-lab',
  templateUrl: 'eng-chlorine-lab.html',
})
export class EngChlorineLabPage {

  _loader: any;
  _alert: any;
  _toast: any;

  date: any;
  month: any;
  year: any;
  recorders: any;
  yesterday_meter:any
  result_date:any;
  user_types: any;
  user: any;
  isHighlightVisible: boolean[];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public engChlorineLabService: EngChlorineLabService,
    public loaderCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public dateService: DateService,
    public authService: AuthService    
  ) {
  }

  ngOnInit() {
    this.isHighlightVisible = [];
    this.isHighlightVisible[0] = true;
    this.authService.getUserDetails()
    .then(result => {
      this.user = result
      this.user_types = this.authService.getUserTypes();
      this.date = this.dateService.getDate();
      this.month = this.dateService.getCurrentDateTime().MM;
      this.year = this.dateService.getCurrentDateTime().YY;
      this.getRecords();
    })
  }
 //Set Hilight
 setHighlight(i) {
  this.isHighlightVisible.fill(false);
  this.isHighlightVisible[i] = true;
  console.log(this.isHighlightVisible);
}
    //OpenPage
    openPage(page: any) {
      this.navCtrl.setRoot(page);
    }
  //Get Supply
  getRecords() {
    this.showLoader()
    this.engChlorineLabService.getRecordByDate(this.date)
      .then((result:any) => {
        console.log(result)
        this.recorders = result.data;
        this.result_date=result.date;
        this.yesterday_meter=result.yesterday_meter
        this.dismissLoader()
      }).catch(err => {
        console.log(err)
        this.showAlert(err)
        this.dismissLoader();
      })
  }

  //Add Supply
  addRecord() {
    let modal = this.modalCtrl.create('EngChlorineLabAddPage', {
      'all_recorders':this.recorders
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
    let modal = this.modalCtrl.create('EngChlorineLabEditPage', {
      'all_recorders':this.recorders,
      'recorder': recorder
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
      title:'ยืนยันการลบ',
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
            this.engChlorineLabService.deleteRecord(recorder.id)
              .then(result => {
                this.dismissLoader();
                this.getRecords();
                this.showToast('ลบข้อมูลเสร็จสิ้น')
              }).catch(err => { this.dismissLoader();this.showAlert(err);  })
          },
          cssClass:'alertConfirm'
        }
      ]
    })
    confirm.present();
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
