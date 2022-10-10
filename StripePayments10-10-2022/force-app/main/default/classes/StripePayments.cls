public with sharing class StripePayments {
    @AuraEnabled
    public static String checkoutUrlGenerator(Id sfRecordId, String lineItems, String successPageUrl, String couponCode){
        String intentConfirmationBody ='success_url='+'https://concretio-fb-dev-ed.my.salesforce-sites.com/success'+'?prevPage='+successPageUrl+'&cancel_url=https://concretio-fb-dev-ed.my.salesforce-sites.com/cancel'+'&mode=payment';
       //!currently changing currency is throwing error (only supporting inr)
        if(couponCode != NULL && couponCode != ''){
            intentConfirmationBody+='&discounts[0][coupon]='+couponCode;    
        }else{
            intentConfirmationBody+='&allow_promotion_codes=true';
        }
        intentConfirmationBody+=lineItems;
        logger.debug(intentConfirmationBody);
                HttpRequest request = new HttpRequest();
                Http http = new Http();
      
                request.setMethod('POST');
                request.setBody(intentConfirmationBody);            
                request.setHeader('Content-Type','application/x-www-form-urlencoded');
                request.setHeader('Authorization','Bearer {!$Credential.Password}');
                request.setEndpoint('callout:Stripe_Api/v1/checkout/sessions');
                HttpResponse response = http.send(request);
        
                String paymentUrl;
                       
                logger.debug('response code: '+response.getStatusCode());
                logger.debug('response code: '+response.getStatus());
                logger.debug(response.getBody());
                logger.saveLog();
           
                if(response.getStatusCode() == 200) {
                    logger.debug('Successfully got the url');
                    logger.debug('The session has been confirmed..');
                    Map<String, Object> result = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
                    //StripeCustomers.updateSfStripeCustomer(result);
                    
                    if(sfRecordId != null){
                        StripeTransactionController.createTransaction(sfRecordId, result);
                    }
                    
                    logger.debug(response.getBody());
                    logger.saveLog();
                    paymentUrl=String.valueOf(result.get('url'));
                   
                }
                else{
                    logger.error(String.valueOf(response.getBody()));
                    logger.saveLog();
                    throw new AuraHandledException(response.getbody());
                }
            return paymentUrl;
    }

    @AuraEnabled
    public static string checkoutUrlGenratorByAmount(Integer amount){
        String itemName = 'test';
        String quantity = '1';
        String currencyName = 'INR';

        String resultString = '&line_items[0][name]='+itemName+'&line_items[0][amount]='+String.valueOf(amount)+'&line_items[0][quantity]='+quantity+'&line_items[0][currency]='+currencyName;

       return checkoutUrlGenerator(null, resultString, 'https://concretio-fb-dev-ed.my.salesforce-sites.com/success', null);
    }

    @AuraEnabled
    public static List<LineItems> getLineItemsById(Id recordId){
        if(Opportunity.Schema.SObjectType == recordId.getSObjectType()){
                Object recordIdObj = recordId;
                Query nebulaQuery = new Query(OpportunityLineItem.Schema.SObjectType);
                nebulaQuery.addField(OpportunityLineItem.Quantity);
                nebulaQuery.addField(OpportunityLineItem.Name);
                nebulaQuery.addField(OpportunityLineItem.UnitPrice);
                nebulaQuery.filterWhere(OpportunityLineItem.OpportunityId, Soql.Operator.EQUALS,recordIdObj);

                List<OpportunityLineItem> relatedProducts;

                try{
                    relatedProducts = nebulaQuery.getResults();
                    logger.debug(String.valueOf(relatedProducts));
                    logger.saveLog();
                }catch(Exception e){
                    logger.error(e.getMessage());
                    logger.saveLog();

                }

                if(relatedProducts.size() > 0){
                    List<LineItems> relatedLineItems = new List<LineItems>();
                    for(OpportunityLineItem oppItem: relatedProducts){
                        relatedLineItems.add(new LineItems(oppItem.Id, oppItem.Name, oppItem.UnitPrice, oppItem.Quantity));
                    }
                    return relatedLineItems;
                }else{
                    return null;
                }




        }else{
            return null;
        }


    }
    public class LineItems{
        @AuraEnabled
        public String id;
        @AuraEnabled
        public string name;
        @AuraEnabled
        public string amount;
        @AuraEnabled
        public string quantity;

        public LineItems(String Id, String name, Decimal amount, Decimal quantity){
            this.Id = Id;
            this.name = name;
            this.amount = String.valueOf(amount);
            this.quantity = String.valueOf(Integer.valueOf(quantity));
        }
    }
}