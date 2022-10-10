public with sharing class StripeTransactionController {
    
    static Helper helper  = new Helper();
    public static Id isExistingTransactionRecord(Id sfRecordId){
        Object sfRecordIdObj = sfRecordId;
        Id transactionId = null;
        //checking is there any existing record in transaction__c with same salesforce record ID
        query nebulaQuery = new query(Schema.Transaction__c.SObjectType);
        nebulaQuery.addField(Transaction__c.Id);
        nebulaQuery.filterWhere(Transaction__c.Record_Id__c, Soql.Operator.EQUALS, sfRecordIdObj);
        
        try{
            transactionId = nebulaQuery.getResults()[0].Id;
        }catch(Exception e){
            logger.error(e.getMessage());
        }
        
        return transactionId;
    }
    
    public static void createTransaction(Id sfRecordId, Map<String,Object>sessionResponse){
        Transaction__c transactionRecord = new Transaction__c();
        //conditional block to check if there is recordId
        //!Currently for guest checkout storing the trnasaction details But this will not store sf Related recordId and url 
        if(sfRecordId != null){
            transactionRecord.Record_Id__c = sfRecordId;
        }
        
        transactionRecord.Stripe_Session_Id__c = String.valueOf(sessionResponse.get('id')); 
        transactionRecord.Total_Amount__c = Decimal.valueOf(String.valueOf(sessionResponse.get('amount_total')));
        transactionRecord.type__c = 'Payment';
        transactionRecord.Payment_Intent_Id__c = String.valueOf(sessionResponse.get('payment_intent'));
        
        fflib_SObjectUnitOfWork uow = new fflib_SObjectUnitOfWork(new List<Schema.SObjectType>{Schema.Transaction__C.SObjectType});
        uow.registerNew(transactionRecord);
        
        try{
            uow.commitWork();
        }catch(Exception e){
            logger.error(e.getMessage());
            logger.saveLog();
        }
        
        
    }
    
    
    //for update transaction status
    public static void updateTransaction(Map<String,Object>sessionResponse){ 
        String transactionId;
        String paymentIntent;
        String sessionType = String.valueOf(sessionResponse.get('type'));
        
        //getting all data from response
        try{
            Map<String,Object> data = (Map<String,Object>)((sessionResponse.get('data')));
            
            try{
                Map<String,Object> dataObject = (Map<String,Object>)((data.get('object')));
                paymentIntent = String.valueOf(dataObject.get('id'));
                
                try{
                    Map<String,Object> charges = (Map<String,Object>)((dataObject.get('charges')));
                    
                    try{
                        List<Object> chargesData = (List<Object>)(charges.get('data'));
                        transactionId = String.valueOf(((Map<String,Object>)(chargesData[0])).get('balance_transaction'));
                        logger.saveLog();
                        
                    }catch(Exception e){
                        logger.error(e.getMessage());
                        logger.saveLog();
                    }
                    
                }catch(Exception e){   
                    logger.error(e.getMessage());
                    logger.saveLog();
                }
            }catch(Exception e){
                logger.error(e.getMessage());
                logger.saveLog();
            }
        }catch(Exception e){
            logger.error(e.getMessage());
            logger.saveLog();     
        }
        
        
        logger.debug('transactionId --> '+transactionId);
        logger.debug('paymentIntent --> '+paymentIntent);
        logger.debug('sessionType --> '+sessionType);
        logger.saveLog();
        
        Transaction__c transactionRecord = helper.getTransaction(paymentIntent);      
        try
        {
            if(sessionType == 'payment_intent.succeeded') {
                
                transactionRecord.Status__c = 'Completed';
                transactionRecord.Transaction_Id__c = transactionId;
            }
            else if(sessionType == 'payment_intent.payment_failed') {
                transactionRecord.Status__c = 'Failed';
            }
            else if(sessionType == 'checkout.session.expired' && transactionRecord.Status__c !='Completed' ) {
                transactionRecord.Status__c = 'Expired';
            }
            fflib_SObjectUnitOfWork uow = new fflib_SObjectUnitOfWork(new List<Schema.SObjectType>{Schema.Transaction__C.SObjectType});
            uow.registerDirty(transactionRecord);
            
            helper.updateTransaction(uow);
            //uow.commitWork();
        }
        catch(Exception e) {
            logger.error(e.getmessage());
            logger.saveLog();
        }
        return;
    }
    
 
    //helper class to avoid guest user restrictions
    private without sharing class Helper 
    {
        //for get a transaction record with sessionId provided by response
        private Transaction__c getTransaction(Object sessionId) {        
            logger.debug((String)sessionId);
            logger.saveLog();
            Transaction__c transactionRecord = new Transaction__c();  
            query nebulaQuery = new query(Schema.Transaction__c.SObjectType);
            nebulaQuery.addField(Schema.Transaction__c.Status__c);
            nebulaQuery.filterWhere(Schema.Transaction__c.Payment_Intent_Id__c, Soql.Operator.EQUALS,sessionId);
            logger.debug(nebulaQuery.getQuery());
            logger.saveLog();
            try {
                logger.debug(String.valueOf(nebulaQuery.getResults()));
                logger.saveLog();
                transactionRecord = (Transaction__c)nebulaQuery.getResults()[0];
                
            }
            catch(Exception e) {
                logger.error(e.getMessage());
                logger.saveLog();
            }
            return transactionRecord;
        } 
        
        //to do dml
        private void updateTransaction(fflib_SObjectUnitOfWork uow) {    
            
            try {
                uow.commitWork();
            }
            catch(Exception e) {
                logger.error(e.getMessage());
                logger.saveLog();
            }
        }
    }
}