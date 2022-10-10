@isTest
public class StripePaymentsTest {
  @isTest static void testCallout() {
        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        
        String res = StripePayments.checkoutUrlGenratorByAmount(1000);
        
        System.assertEquals('https://checkout.stripe.com/c/pay/cs_test_b1zE5wWEGkfsCdrGVsVuwIPIyWFxBwT9Wl4TFTh5VQZjvYr4KFOrwf08OJ#fidkdWxOYHwnPyd1blpxYHZxWjA0TGxdXV1WQ1B9bDVfQ2JVMWtpbE1fb0h0ZDNSaW9IMU9XRnZwN0RGYzxXPXQyV3dCXWF2PGxPPUdTXV1uaWJ0bl1WYmc9fVdSb2R8d3NtTmdraW49YGFLNTV%2FPUxENnQ0YScpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPydocGlxbFpscWBoJyknYGtkZ2lgVWlkZmBtamlhYHd2Jz9xd3BgeCUl', res);
    }
}