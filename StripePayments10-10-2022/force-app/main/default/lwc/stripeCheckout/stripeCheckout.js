import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import checkoutUrlGenerator from '@salesforce/apex/StripePayments.checkoutUrlGenerator';
import getRecentTransactions from '@salesforce/apex/StripeTransactions.getRecentTransactions';
import getLineItemsById from '@salesforce/apex/StripePayments.getLineItemsById';
const CURRENCY = [
  {
    "value": "AED",
    "label": "UAE dirhams"
  },
  {
    "value": "AFN",
    "label": "Afghan Afghanis"
  },
  {
    "value": "ALL",
    "label": "Albanian lekë"
  },
  {
    "value": "AMD",
    "label": "Armenian drams"
  },
  {
    "value": "ANG",
    "label": "Netherlands Antillean guilders"
  },
  {
    "value": "AOA",
    "label": "Angolan kwanzas"
  },
  {
    "value": "ARS",
    "label": "Argentine pesos"
  },
  {
    "value": "AUD",
    "label": "Australian dollars"
  },
  {
    "value": "AWG",
    "label": "Aruban florin"
  },
  {
    "value": "AZN",
    "label": "Azerbaijani manats"
  },
  {
    "value": "BAM",
    "label": "Bosnia-Herzegovina convertible marks"
  },
  {
    "value": "BBD",
    "label": "Barbadian dollars"
  },
  {
    "value": "BDT",
    "label": "Bangladeshi takas"
  },
  {
    "value": "BGN",
    "label": "Bulgarian leva"
  },
  {
    "value": "BHD",
    "label": "Bahraini dinars"
  },
  {
    "value": "BIF",
    "label": "Burundian francs"
  },
  {
    "value": "BMD",
    "label": "Bermudan dollars"
  },
  {
    "value": "BND",
    "label": "Brunei dollars"
  },
  {
    "value": "BOB",
    "label": "Bolivian bolivianos"
  },
  {
    "value": "BRL",
    "label": "Brazilian reals"
  },
  {
    "value": "BSD",
    "label": "Bahamian dollars"
  },
  {
    "value": "BTN",
    "label": "Bhutanese ngultrums"
  },
  {
    "value": "BWP",
    "label": "Botswanan pulas"
  },
  {
    "value": "BYN",
    "label": "Belarusian rubles"
  },
  {
    "value": "BZD",
    "label": "Belize dollars"
  },
  {
    "value": "CAD",
    "label": "Canadian dollars"
  },
  {
    "value": "CDF",
    "label": "Congolese francs"
  },
  {
    "value": "CHF",
    "label": "Swiss francs"
  },
  {
    "value": "CLP",
    "label": "Chilean pesos"
  },
  {
    "value": "CNY",
    "label": "Chinese yuan"
  },
  {
    "value": "COP",
    "label": "Colombian pesos"
  },
  {
    "value": "CRC",
    "label": "Costa Rican colóns"
  },
  {
    "value": "CUC",
    "label": "Cuban convertible pesos"
  },
  {
    "value": "CUP",
    "label": "Cuban pesos"
  },
  {
    "value": "CVE",
    "label": "Cape Verdean escudos"
  },
  {
    "value": "CZK",
    "label": "Czech korunas"
  },
  {
    "value": "DJF",
    "label": "Djiboutian francs"
  },
  {
    "value": "DKK",
    "label": "Danish kroner"
  },
  {
    "value": "DOP",
    "label": "Dominican pesos"
  },
  {
    "value": "DZD",
    "label": "Algerian dinars"
  },
  {
    "value": "EGP",
    "label": "Egyptian pounds"
  },
  {
    "value": "ERN",
    "label": "Eritrean nakfas"
  },
  {
    "value": "ETB",
    "label": "Ethiopian birrs"
  },
  {
    "value": "EUR",
    "label": "euros"
  },
  {
    "value": "FJD",
    "label": "Fijian dollars"
  },
  {
    "value": "FKP",
    "label": "Falkland Islands pounds"
  },
  {
    "value": "GBP",
    "label": "British pounds"
  },
  {
    "value": "GEL",
    "label": "Georgian laris"
  },
  {
    "value": "GHS",
    "label": "Ghanaian cedis"
  },
  {
    "value": "GIP",
    "label": "Gibraltar pounds"
  },
  {
    "value": "GMD",
    "label": "Gambian dalasis"
  },
  {
    "value": "GNF",
    "label": "Guinean francs"
  },
  {
    "value": "GTQ",
    "label": "Guatemalan quetzals"
  },
  {
    "value": "GYD",
    "label": "Guyanaese dollars"
  },
  {
    "value": "HKD",
    "label": "Hong Kong dollars"
  },
  {
    "value": "HNL",
    "label": "Honduran lempiras"
  },
  {
    "value": "HRK",
    "label": "Croatian kunas"
  },
  {
    "value": "HTG",
    "label": "Haitian gourdes"
  },
  {
    "value": "HUF",
    "label": "Hungarian forints"
  },
  {
    "value": "IDR",
    "label": "Indonesian rupiahs"
  },
  {
    "value": "ILS",
    "label": "Israeli new shekels"
  },
  {
    "value": "INR",
    "label": "Indian rupees"
  },
  {
    "value": "IQD",
    "label": "Iraqi dinars"
  },
  {
    "value": "IRR",
    "label": "Iranian rials"
  },
  {
    "value": "ISK",
    "label": "Icelandic krónur"
  },
  {
    "value": "JMD",
    "label": "Jamaican dollars"
  },
  {
    "value": "JOD",
    "label": "Jordanian dinars"
  },
  {
    "value": "JPY",
    "label": "Japanese yen"
  },
  {
    "value": "KES",
    "label": "Kenyan shillings"
  },
  {
    "value": "KGS",
    "label": "Kyrgystani soms"
  },
  {
    "value": "KHR",
    "label": "Cambodian riels"
  },
  {
    "value": "KMF",
    "label": "Comorian francs"
  },
  {
    "value": "KPW",
    "label": "North Korean won"
  },
  {
    "value": "KRW",
    "label": "South Korean won"
  },
  {
    "value": "KWD",
    "label": "Kuwaiti dinars"
  },
  {
    "value": "KYD",
    "label": "Cayman Islands dollars"
  },
  {
    "value": "KZT",
    "label": "Kazakhstani tenges"
  },
  {
    "value": "LAK",
    "label": "Laotian kips"
  },
  {
    "value": "LBP",
    "label": "Lebanese pounds"
  },
  {
    "value": "LKR",
    "label": "Sri Lankan rupees"
  },
  {
    "value": "LRD",
    "label": "Liberian dollars"
  },
  {
    "value": "LSL",
    "label": "Lesotho lotis"
  },
  {
    "value": "LYD",
    "label": "Libyan dinars"
  },
  {
    "value": "MAD",
    "label": "Moroccan dirhams"
  },
  {
    "value": "MDL",
    "label": "Moldovan lei"
  },
  {
    "value": "MGA",
    "label": "Malagasy ariaries"
  },
  {
    "value": "MKD",
    "label": "Macedonian denari"
  },
  {
    "value": "MMK",
    "label": "Myanmar kyats"
  },
  {
    "value": "MNT",
    "label": "Mongolian tugriks"
  },
  {
    "value": "MOP",
    "label": "Macanese patacas"
  },
  {
    "value": "MRU",
    "label": "Mauritanian ouguiyas"
  },
  {
    "value": "MUR",
    "label": "Mauritian rupees"
  },
  {
    "value": "MVR",
    "label": "Maldivian rufiyaas"
  },
  {
    "value": "MWK",
    "label": "Malawian kwachas"
  },
  {
    "value": "MXN",
    "label": "Mexican pesos"
  },
  {
    "value": "MYR",
    "label": "Malaysian ringgits"
  },
  {
    "value": "MZN",
    "label": "Mozambican meticals"
  },
  {
    "value": "NAD",
    "label": "Namibian dollars"
  },
  {
    "value": "NGN",
    "label": "Nigerian nairas"
  },
  {
    "value": "NIO",
    "label": "Nicaraguan córdobas"
  },
  {
    "value": "NOK",
    "label": "Norwegian kroner"
  },
  {
    "value": "NPR",
    "label": "Nepalese rupees"
  },
  {
    "value": "NZD",
    "label": "New Zealand dollars"
  },
  {
    "value": "OMR",
    "label": "Omani rials"
  },
  {
    "value": "PAB",
    "label": "Panamanian balboas"
  },
  {
    "value": "PEN",
    "label": "Peruvian soles"
  },
  {
    "value": "PGK",
    "label": "Papua New Guinean kina"
  },
  {
    "value": "PHP",
    "label": "Philippine pesos"
  },
  {
    "value": "PKR",
    "label": "Pakistani rupees"
  },
  {
    "value": "PLN",
    "label": "Polish zlotys"
  },
  {
    "value": "PYG",
    "label": "Paraguayan guaranis"
  },
  {
    "value": "QAR",
    "label": "Qatari rials"
  },
  {
    "value": "RON",
    "label": "Romanian lei"
  },
  {
    "value": "RSD",
    "label": "Serbian dinars"
  },
  {
    "value": "RUB",
    "label": "Russian rubles"
  },
  {
    "value": "RWF",
    "label": "Rwandan francs"
  },
  {
    "value": "SAR",
    "label": "Saudi riyals"
  },
  {
    "value": "SBD",
    "label": "Solomon Islands dollars"
  },
  {
    "value": "SCR",
    "label": "Seychellois rupees"
  },
  {
    "value": "SDG",
    "label": "Sudanese pounds"
  },
  {
    "value": "SEK",
    "label": "Swedish kronor"
  },
  {
    "value": "SGD",
    "label": "Singapore dollars"
  },
  {
    "value": "SHP",
    "label": "St. Helena pounds"
  },
  {
    "value": "SLL",
    "label": "Sierra Leonean leones"
  },
  {
    "value": "SOS",
    "label": "Somali shillings"
  },
  {
    "value": "SRD",
    "label": "Surinamese dollars"
  },
  {
    "value": "SSP",
    "label": "South Sudanese pounds"
  },
  {
    "value": "STN",
    "label": "São Tomé & Príncipe dobras"
  },
  {
    "value": "SVC",
    "label": "Salvadoran colones"
  },
  {
    "value": "SYP",
    "label": "Syrian pounds"
  },
  {
    "value": "SZL",
    "label": "Swazi emalangeni"
  },
  {
    "value": "THB",
    "label": "Thai baht"
  },
  {
    "value": "TJS",
    "label": "Tajikistani somonis"
  },
  {
    "value": "TMT",
    "label": "Turkmenistani manat"
  },
  {
    "value": "TND",
    "label": "Tunisian dinars"
  },
  {
    "value": "TOP",
    "label": "Tongan paʻanga"
  },
  {
    "value": "TRY",
    "label": "Turkish Lira"
  },
  {
    "value": "TTD",
    "label": "Trinidad & Tobago dollars"
  },
  {
    "value": "TWD",
    "label": "New Taiwan dollars"
  },
  {
    "value": "TZS",
    "label": "Tanzanian shillings"
  },
  {
    "value": "UAH",
    "label": "Ukrainian hryvnias"
  },
  {
    "value": "UGX",
    "label": "Ugandan shillings"
  },
  {
    "value": "USD",
    "label": "US dollars"
  },
  {
    "value": "UYU",
    "label": "Uruguayan pesos"
  },
  {
    "value": "UZS",
    "label": "Uzbekistani som"
  },
  {
    "value": "VES",
    "label": "Venezuelan bolívars"
  },
  {
    "value": "VND",
    "label": "Vietnamese dong"
  },
  {
    "value": "VUV",
    "label": "Vanuatu vatus"
  },
  {
    "value": "WST",
    "label": "Samoan tala"
  },
  {
    "value": "XAF",
    "label": "Central African CFA francs"
  },
  {
    "value": "XCD",
    "label": "East Caribbean dollars"
  },
  {
    "value": "XDR",
    "label": "special drawing rights"
  },
  {
    "value": "XOF",
    "label": "West African CFA francs"
  },
  {
    "value": "XPF",
    "label": "CFP francs"
  },
  {
    "value": "XSU",
    "label": "Sucres"
  },
  {
    "value": "YER",
    "label": "Yemeni rials"
  },
  {
    "value": "ZAR",
    "label": "South African rand"
  },
  {
    "value": "ZMW",
    "label": "Zambian kwachas"
  },
  {
    "value": "ZWL",
    "label": "Zimbabwean dollars (2009)"
  }
];
export default class StripeCheckout extends LightningElement {
    @api recordId;
    @api customerId = null;
    @track amount;
    @track currency = CURRENCY;
    @track currencyValue = 'INR';
    @track itemName;
    @track couponCode;
    @track haveCoupon = false;
    @track isLoading = false;
    @track defaultItems = [{id:'0', name:'', amount:'', quantity:''}];

    //Transactions Section
    @track showTransactionsSection = false;
    @track transactionsData = [];



   //to get all currency names
    get getCurrencyNames(){
        return this.currency;
    }
    
    // input change method used for normal field inputs value change
    handleInputChange(event){

      if(event.target.name == 'CouponCode'){
          this.couponCode = event.target.value;
      }
      else{
        let index = event.currentTarget.dataset.id;
        (this.defaultItems[index])[event.target.name] = event.target.value;

      }

    }

    // change method for combobox changes
    handleChange(event) {
        this.currencyValue = event.detail.value;
    }





    // impreative method to create a new session to generate the payment url returns String(paymentUrl)
    createCheckoutSession(resultString){
      this.isLoading = true;
      var sfRecordId = null;
      if(this.recordId){
        sfRecordId = this.recordId
      }
        checkoutUrlGenerator({sfRecordId: sfRecordId, lineItems: resultString, successPageUrl: window.location.href, couponCode: this.couponCode})
        .then(result => {
          this.isLoading = false;
            window.location.assign(result);
        })
        .catch(error => {
          this.isLoading = false;
          if((JSON.parse(error.body.message).error.message).match("coupon")){
            this.showToast('error', 'Invaid Coupon', 'Please Enter a Valid Coupon Code');
          }
        });
    }

    // on submit button click 
    handlePayNow(){
      //Checking if all the required fields are filled 
      var isValid = true;
        if(this.template.querySelectorAll('lightning-input')){
          var inputs = this.template.querySelectorAll('lightning-input');
          inputs.forEach(item => {
            if(!item.reportValidity()){
              isValid = false;
            }
            
          })

        }
      //Calling session creation method
       if(isValid){
        var resultString="";

        for(var i=0; i<this.defaultItems.length; i++){
          this.defaultItems[i].amount*=100;
          resultString+="&line_items["+i+"][name]="+String(this.defaultItems[i].name)+"&line_items["+i+"][amount]="+parseInt(this.defaultItems[i].amount)+"&line_items["+i+"][quantity]="+String(this.defaultItems[i].quantity)+"&line_items["+i+"][currency]="+this.currencyValue;
        }
          this.createCheckoutSession(resultString);
       }

    }

    //showToast Method to show the message at the mid top of the screen
    showToast(variant, title, message) {
      const event = new ShowToastEvent({
          variant: variant,
          title: title,
          message:
              message
      });
      this.dispatchEvent(event);
  }

  toggleCoupon(){
    this.haveCoupon  = !this.haveCoupon;
  }

  
  //Methods to add and remove list Items
  
  addItem(){
    this.defaultItems.push({id:String(this.defaultItems.length+1), name:'', amount:''});
  }

  removeItem(event){
    if(this.defaultItems.length>1){
      var index= event.currentTarget.dataset.id;
      this.defaultItems.splice(index,1);
    }
   
  }



  //imperative method to get recent transactions for salesforce (APEX)
  getTransactionsByRecordId(){
      getRecentTransactions({recordId: this.recordId})
      .then(result => {
        this.isLoading = false;
        this.showTransactionsSection = true;
        this.transactionsData = JSON.parse(JSON.stringify(result))
        console.log(this.transactionsData);
      })
      .catch(error => {
        this.isLoading = false;
        console.log(error);
      });
  }

  //get Transaction on button click
  getTransactions(){
    this.isLoading = true;
    this.getTransactionsByRecordId();
  }

  getDefLineItems(){
    getLineItemsById({recordId: this.recordId})
        .then(result =>{
          this.isLoading = false;
            if(result != null){
              this.defaultItems = [];
              this.defaultItems = JSON.parse(JSON.stringify(result));
            }
        })
        .catch(error =>{
          this.isLoading = false;
            console.log(error);
        });
  }

  //method when toggle is clicked  to check related products
  checkRelatedProducts(event){
      if(event.target.checked == true){
        this.isLoading = true;
        this.getDefLineItems();
      }
      else{
        this.defaultItems = [{id:'0', name:'', amount:'', quantity:''}];
      }
    console.log(event.target.checked);
  }
    
}