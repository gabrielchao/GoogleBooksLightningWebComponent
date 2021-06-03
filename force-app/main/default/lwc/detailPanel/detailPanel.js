import { LightningElement, api } from 'lwc';

export default class DetailPanel extends LightningElement {
    volumeItem;
    identifiers = [];

    @api
    get item() {
        return this.volumeItem;
    }
    set item(value) {
        this.volumeItem = value;
        if(this.volumeItem) {
            this.identifiers = this.volumeItem.volumeInfo.industryIdentifiers.map(identifier => `${identifier.type}: ${identifier.identifier}`);
        }
    }
}