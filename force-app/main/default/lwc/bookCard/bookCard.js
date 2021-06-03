import { LightningElement, api, wire } from 'lwc';
import titleExists from '@salesforce/apex/BooksDataController.titleExists';

export default class BookCard extends LightningElement {
    volumeItem;
    title;
    authors;
    databaseStatus="nonexistent";

    @api
    get item() {
        return this.volumeItem;
    }
    set item(value) {
        this.volumeItem = value;
        this.title = this.volumeItem.volumeInfo.title;
        this.authors = this.volumeItem.volumeInfo.authors.reduce((a, b) => a + ', ' + b);
        this.refreshButton();
    }

    get isNonexistent() {
        return this.databaseStatus === "nonexistent";
    }

    get isExists() {
        return this.databaseStatus === "exists";
    }

    get isLoading() {
        return this.databaseStatus === "loading";
    }

    @api
    waitThenRefreshButton() {
        this.databaseStatus = "loading"
        setTimeout(() => {
            this.refreshButton();
        }, 300);
    }

    refreshButton() {
        console.log(`Refreshing ${this.volumeItem.id} button`);
        titleExists({
            title: this.title,
            authors: this.authors
        }).then(result => {
            console.log("result: " + result);
            this.databaseStatus = result ? "exists" : "nonexistent";
        }).catch(err => {
            console.log(err);
            this.databaseStatus = "nonexistent";
        })
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