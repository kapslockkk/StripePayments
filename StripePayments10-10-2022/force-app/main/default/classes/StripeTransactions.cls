public with sharing class StripeTransactions {
    
   @AuraEnabled
    public static List<Transaction__c> getRecentTransactions(String recordId){
        logger.debug('recordID --> '+recordId);
        logger.saveLog();
        if(recordId != null){
            Object recordIdObj = recordId;
            query nebulaQuery = new query(Schema.Transaction__c.SObjectType);
            //nebulaQuery.addFields(soql.FieldCategory.CUSTOM);// To get all the custom fields
            nebulaQuery.addField(Transaction__c.Status__c);
            nebulaQuery.addField(Transaction__c.Total_Amount__c);
            nebulaQuery.addField(Transaction__c.LastModifiedDate);
            nebulaQuery.addField(Transaction__c.Payment_Intent_Id__c);
            nebulaQuery.filterWhere(Transaction__c.Record_Id__c, soql.Operator.EQUALS, recordIdObj);
           
            try{
                List<Transaction__c>transactions = (nebulaQuery.getResults()).clone();
                // for(Integer i = 0; i < transactions.size(); i++){
                //     transactions[i].LastModifiedDate = (transactions[i].LastModifiedDate).date();
                // }
                logger.debug(String.valueOf(transactions));
                logger.saveLog();
                return Transactions;               
            }catch(Exception e){
                logger.error(e.getMessage());
                logger.saveLog();

            }
        }
        
        return null;
    }
}