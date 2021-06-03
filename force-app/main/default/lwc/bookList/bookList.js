import { api, LightningElement } from 'lwc';


export default class BookList extends LightningElement {
    @api
    items;
    handleAdd(evt) {
        const id = evt.detail.value;
        const reference = evt.detail.reference;
        try {
            this.dispatchEvent(new CustomEvent("add", {
                detail: {
                    value: id,
                    reference: reference
                }
            }));
            return;
        } catch(err) {
            console.log(err);
        }
    }

    handleCardClick(evt) {
        const id = evt.target.getAttribute("data-id");
        try {
            this.dispatchEvent(new CustomEvent("cardclick", {
                detail: {
                    value: id
                }
            }));
            return;
        } catch(err) {
            console.log(err);
        }
    }

    @api
    refreshCardButton(id) {
        const card = this.template.querySelector(`[data-id="${id}"]`);
        card.waitThenRefreshButton();
    }
}