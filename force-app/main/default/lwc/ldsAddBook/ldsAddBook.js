import { createRecord } from 'lightning/uiRecordApi';
import getPublisherId from '@salesforce/apex/BooksDataController.getPublisherId';
import PUBLISHER_OBJECT from '@salesforce/schema/Publisher__c';
import PUBLISHER_NAME_FIELD from '@salesforce/schema/Publisher__c.Name';
import PUBLISHER_COUNTRY_FIELD from '@salesforce/schema/Publisher__c.Country__c';
import TITLE_OBJECT from '@salesforce/schema/Title__c';
import TITLE_NAME_FIELD from '@salesforce/schema/Title__c.Name';
import TITLE_AUTHOR_FIELD from '@salesforce/schema/Title__c.Author__c';
import TITLE_DESCRIPTION_FIELD from '@salesforce/schema/Title__c.Description__c';
import TITLE_PUBLISHER_FIELD from '@salesforce/schema/Title__c.Publisher__c';

export async function addBook(item) {
    try {
        let publisherId;
        publisherId = await getPublisherId({ name: item.volumeInfo.publisher });
        if(!publisherId) {
            const publisherRecordInput = {
                apiName: PUBLISHER_OBJECT.objectApiName,
                fields: {
                    [PUBLISHER_NAME_FIELD.fieldApiName]: item.volumeInfo.publisher
                }
            };   
            const publisherRecord = await createRecord(publisherRecordInput);
            console.log('Created ' + JSON.stringify(publisherRecord));
            publisherId = publisherRecord.id;
        } 
        try {
            const authors = item.volumeInfo.authors.reduce((a, b) => a + ', ' + b);
            const titleRecordInput = {
                apiName: TITLE_OBJECT.objectApiName,
                fields: {
                    [TITLE_NAME_FIELD.fieldApiName]: item.volumeInfo.title,
                    [TITLE_AUTHOR_FIELD.fieldApiName]: authors,
                    [TITLE_DESCRIPTION_FIELD.fieldApiName]: item.volumeInfo.description,
                    [TITLE_PUBLISHER_FIELD.fieldApiName]: publisherId
                }
            };
            const titleRecord = await createRecord(titleRecordInput);
            console.log('Created ' + JSON.stringify(titleRecord));
        } catch (err) {
            throw err;
        }
    } catch (err) {
        throw err;
    }
}