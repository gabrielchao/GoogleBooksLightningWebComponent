import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { addBook } from 'c/ldsAddBook';
import callBooks from '@salesforce/apex/BooksDataController.callBooks';

import { createRecord } from 'lightning/uiRecordApi';
import PUBLISHER_OBJECT from '@salesforce/schema/Publisher__c';
import PUBLISHER_NAME_FIELD from '@salesforce/schema/Publisher__c.Name';
import PUBLISHER_COUNTRY_FIELD from '@salesforce/schema/Publisher__c.Country__c';
import TITLE_OBJECT from '@salesforce/schema/Title__c';
import TITLE_NAME_FIELD from '@salesforce/schema/Title__c.Name';
import TITLE_AUTHOR_FIELD from '@salesforce/schema/Title__c.Author__c';
import TITLE_DESCRIPTION_FIELD from '@salesforce/schema/Title__c.Description__c';
import TITLE_PUBLISHER_FIELD from '@salesforce/schema/Title__c.Publisher__c';

export default class GoogleBooks extends LightningElement {
    @api queryTerm;
    authorTerm = '';
    publisherTerm = '';
    startIndex;
    itemsPerPage = 20;
    volumesData;
    selectedItem;
    error;
    loading;
    
    async handleAddItem(evt) {
        const id = evt.detail.value;
        const index = this.volumesData.items.findIndex(item => item.id === id);
        const item = this.volumesData.items[index];
        try {
            await addBook(item);
            this.template.querySelector("c-book-list").refreshCardButton(id);
            const toastEvent = new ShowToastEvent({
                title: "Success",
                message: "Book added!",
                variant: "success"
            });
            this.dispatchEvent(toastEvent);
        } catch(err) {
            const toastEvent = new ShowToastEvent({
                title: "Error",
                message: err.message,
                variant: "failure"
            });
            this.dispatchEvent(toastEvent);
        }
    }

    handleSearchKeyUp(evt) {
        const isEnterKey = evt.keyCode === 13;
        if(isEnterKey) {
            this.queryTerm = evt.target.value;
            this.startIndex = 0;
            this.search();
        }
    }

    handleFilterKeyUp(evt) {
        const isEnterKey = evt.keyCode === 13;
        if(isEnterKey) {
            this.startIndex = 0;
            this.search();
        }
    }

    handleAuthorChange(evt) {
        this.authorTerm = evt.target.value;
    }

    handlePublisherChange(evt) {
        this.publisherTerm = evt.target.value;
    }

    handleNextPage(evt) {
        this.startIndex = this.startIndex + this.itemsPerPage;
        this.search();
    }

    handlePreviousPage(evt) {
        this.startIndex = this.startIndex - this.itemsPerPage;
        this.search();
    }

    handleCardClick(evt) {
        const id = evt.detail.value;
        this.selectedItem = this.volumesData.items.find(item => item.id === id);
    }

    search() {
        this.volumesData = false;
        this.selectedItem = false;
        this.error = false;
        this.loading = true;
        callBooks({
            query: this.queryTerm,
            authorFilter: this.authorTerm,
            publisherFilter: this.publisherTerm,
            startIndex: this.startIndex,
            maxResults: this.itemsPerPage
        })
        .then(result => {
            const vols = JSON.parse(result);
            if(vols.items == undefined) {
                if(vols.error) {
                    throw new Error(vols.error.message);
                }
                else {
                    throw new Error('Unknown error occurred.');
                }
            }
            vols.items = vols.items.filter(item => item.volumeInfo.authors);
            this.volumesData = vols;
            this.error = false;
            this.loading = false;
        })
        .catch(error => {
            this.volumesData = false;
            this.error = 'Search failed: ' + error.message;
            this.loading = false;
        });
    }

    get startDisplayIndex() {
        return this.startIndex + 1;
    }

    get endDisplayIndex() {
        return Math.min(this.startDisplayIndex + this.itemsPerPage - 1, this.volumesData.totalItems);
    }
}