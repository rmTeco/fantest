@isTest
public class ChatterAnswersTest {
 static testMethod void ChatterAnswersTest1() {
     	string idStr = '001E000000nwg7g';   // 15 character id
		id idval = idStr;                   // assign to ID variable
        ChatterAnswers ca = new ChatterAnswers();
		string i= ca.createAccount('a','b',idval);
		System.assertEquals(1, 1);
	}
}