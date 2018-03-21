import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DatabaseProvider } from '../../providers/database/database';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';

/**
 * Generated class for the CollectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-collect',
  templateUrl: 'collect.html',
})
export class CollectPage {

  subscribers: any = [];
  areasInCompany: any = [];
  companies: any = [];
  filteredSubscribers = [];
  company: any;
  filterSetting: { companyIDSelected: string, areaIDSelected: string };
  dbAreas: any = [];
  areaDetails: any = [];

  selectedCompany: any = [];
  selectedAreas: any = [];
  selectedDate: any = [];

  toggleSearchState: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public dbProvider: DatabaseProvider, public platform: Platform,
    public storage: Storage,
    public loadingController: LoadingController) {

    this.selectedCompany = this.getFromStorage("selectedCompany");//this.navParam.get('selectedCompany');
    this.selectedAreas = this.getFromStorage('selectedAreas');//this.navParam.get('selectedAreas');
    this.selectedDate = "20018-01-01" ; //this.getFromStorage("selectedDate");//this.navParam.get('selectedDate');

    this.dbProvider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        dbProvider.getAreasForCompany("1").then(data => {
          this.dbAreas = data;
          console.log("areas from db:", this.dbAreas);
        });
      }
    });

    console.log('selectedAreas val', this.selectedAreas);

    this.storage.set('selectedFilters', {
      selectedCompany: this.selectedCompany, selectedAreas: this.selectedAreas,
      selectedDate: this.selectedDate
    });
  }

  getFromStorage(key) {
    console.log('from storage key ', key);

    this.storage.get(key).then((resp) => {
      if (resp !== null) {
        console.log('Value for key is ', resp);
            return resp;
      }
      else
      {
    console.log('Couldnt find value for ', key);
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CollectPage');
    this.dbProvider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.dbProvider.getAllCompanies().then(data => {
          this.companies = data;
          console.log("companies from db:", this.companies);
        });

        this.dbProvider.getAreasForCompany("1").then(data => {
          this.areasInCompany = data;
          console.log("selectedCompany for area filtering:", this.selectedCompany);
        });
      }
    });

    if (this.selectedDate && this.selectedDate != '' && this.selectedDate.indexOf('-') > 0) {
      var dateData = this.selectedDate.split('-');
      this.dbProvider.getDatabaseState().subscribe(rdy => {
        if (rdy) {
          this.dbProvider.getSubscriberPaymentsForAreaAndMonthYear(this.selectedAreas, "01", "2018").then(
            data => {
              this.subscribers = this.filteredSubscribers = data;
              console.log("searched subscribers:", data);
            }
          );
        }
      });

      this.dbProvider.getDatabaseState().subscribe(rdy => {
        if (rdy) {
          this.dbProvider.getAreaForID(this.selectedAreas).then(
            data => {
              this.areaDetails = data[0];
              console.log("selected area:", this.areaDetails.area_name);
            }
          );
        }
      });

      //let comp = this.cableAPI.getCompanies().then(data => this.companies = data);
      /*let selectecComp = this.cableAPI.getSubscriberData(1, 1).subscribe(data => {
        this.subscribers = this.filteredSubscribers = data;
      });*/
    }
  }

  private presentLoadingCustom() {
    let loading = this.loadingController.create({
      spinner: 'hide',
      content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"></div>
        </div>`,
      duration: 5000
    });
    loading.onDidDismiss(() => {
      console.log('Dismissed loading');
    });

    loading.present();
  }

  public onCompanyChange(selectedValue: any) {
    this.dbProvider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.dbProvider.getAreasForCompany(selectedValue).then(data => {
          this.areasInCompany = data;
        });
      }
    });
  }

  public setFilterValues() {
    this.toggleSearchState = false;

    this.storage.set('selectedCompany', this.selectedCompany);
    this.storage.set('selectedAreas', this.selectedAreas);
    this.storage.set('selectedDate', this.selectedDate);

    console.log("this.selectedDate=", this.selectedDate);
    //if (this.selectedDate && this.selectedDate != '' && this.selectedDate.indexOf('-') > 0) {
      //var dateData = this.selectedDate.split('-');
      this.dbProvider.getDatabaseState().subscribe(rdy => {
        if (rdy) {
          this.dbProvider.getSubscriberPaymentsForAreaAndMonthYear(this.selectedAreas, "01", "2018").then(
            data => {
              this.subscribers = this.filteredSubscribers = data;
              console.log("searched subscribers:", data);
            }
          );
        }
      });
    //}
  }

  itemSelected(item) {
    console.log(item);
  }

  toggleSearch() {
    console.log("toggleSearchState=" + this.toggleSearchState);
    this.toggleSearchState = !this.toggleSearchState;
  }

  getItems(eventVal: any) {
    this.storage.get('selectedCompany')
      .then((data) => {
        console.log('selectedCompany', data);
      })
      .catch((ex) => { console.log(ex); });

    let searchTerm = eventVal.target.value;
    if (searchTerm && searchTerm != '')
      this.filteredSubscribers = this.subscribers.filter((item) => {
        return item.subscriber_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      });
    else
      this.filteredSubscribers = this.subscribers;
    // Get all areas
    /*const curr: string[] = this.filteredSubscribers.map(data => data.areaid);
    // Unique areas
    this.uniqueAreas = curr.filter((x, i, a) => x && a.indexOf(x) === i);*/
  }

  saveAsNextMonth(enteredValue: any) {
    if (enteredValue && enteredValue != '') {
      enteredValue.paid_amount = "N/M";
      this.savePayment(enteredValue);
    }
  }
  savePayment(enteredValue: any) {
    if (enteredValue && enteredValue != '') {
      this.dbProvider.getDatabaseState().subscribe(rdy => {
        if (rdy) {
          let paymentmade = { paid_amount: enteredValue.paid_amount, payment_date: "2018-01-10", other_action: "", payment_history_id: enteredValue.payment_history_id };
          this.dbProvider.updatePaymentHistory(paymentmade).then(
            data => {
              console.log("Saved!!!:", data);
            }
          );
        }
      });
    }
  }
}
