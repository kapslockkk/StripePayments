@RestResource(urlMapping='/StripeWebhook')
    global without sharing class StripeWebhook {
        @HttpPost
        global static String handlePost() {
            system.debug('In Post Method');
            RestRequest req = RestContext.request;
            RestResponse res = RestContext.response;
            String reqJson= req.requestBody.toString();
            String resBody='';
            try{
                
                res.statusCode=201;
                
                resBody = '{"success":true}';

                String[] strings = getTypeEmail(reqJson);

                res.responseBody = Blob.valueOf(resBody);
                
                StripeTransactionController.updateTransaction((Map<String,Object>)JSON.deserializeUntyped(reqJson));
               	Logger.debug('Webhook');
                Logger.debug(reqJson);
              	Logger.saveLog();
                return 'success';
            } catch (Exception e){
                res.statusCode=400;
                resBody = '{"success":false}';
                res.responseBody = Blob.valueOf(resBody);
                
               Logger.error(e.getMessage());
               Logger.saveLog();
                return e.getMessage();
            }
            

        }
        global static String[] getTypeEmail(String reqJson){
            JSONParser parser = JSON.createParser(reqJson);
            String[] strs=new String[]{'status','contactEmail'};
                while (parser.nextToken() != null) {
                    if(parser.getText()=='metadata') {
                        while (parser.nextToken() != null) {
                            if(parser.getText()=='email'){
                                parser.nextToken();
                                strs[1]=parser.getText();
                            }
                        }
                    }
                }
            
            JSONParser parser2 = JSON.createParser(reqJson);
            while (parser2.nextToken() != null) {
                if(parser2.getText()=='data') {
                    while (parser2.nextToken() != null) {
                        if(parser2.getText()=='object') {
                            while (parser2.nextToken() != null) {
                                if(parser2.getText()=='status'){
                                    parser2.nextToken();
                                    strs[0]=parser2.getText();
                                }
                            }
                        }
                    }
                }
            } 
            return strs;
        }
    }