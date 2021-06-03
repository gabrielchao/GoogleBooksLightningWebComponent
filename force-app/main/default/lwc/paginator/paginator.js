import { LightningElement, api } from 'lwc';

export default class Paginator extends LightningElement {
    @api startindex;
    @api endindex;
    @api totalindices;

    get hasPreviousPage() {
        return this.startindex > 1;
    }

    get hasMorePages() {
        return this.endindex < this.totalindices;
    }

    handlePagePrevious() {
        this.dispatchEvent(new CustomEvent('previouspage'));
    }

    handlePageNext() {
        this.dispatchEvent(new CustomEvent('nextpage'));
    }
}