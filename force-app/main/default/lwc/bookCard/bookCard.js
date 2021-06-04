import { LightningElement, api, wire } from 'lwc';
import titleExists from '@salesforce/apex/BooksDataController.titleExists';

export default class BookCard extends LightningElement {
    @api item;

    get isNonexistent() {
        return this.item.salesforceStatus === "nonexistent";
    }

    get isExists() {
        return this.item.salesforceStatus === "exists";
    }

    get isLoading() {
        return this.item.salesforceStatus === "loading";
    }

    handleAddClick(evt) {
        evt.preventDefault();
        this.dispatchEvent(new CustomEvent("add", {
            detail: {
                value: this.item.id,
                reference: this
            }
        }));
    }
}