import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
export default class PaymentSuccessComponent extends LightningElement {
    @wire(CurrentPageReference)
    pageRef;
}