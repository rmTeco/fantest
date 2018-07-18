function txDate_Keyup()
 {
 	var d = new Date();
 	var Obj=event.srcElement;
		
	if (event.keyCode != 8)
	{
	 	if (Obj.value.length == 2)
			Obj.value += '/';
		
		if (Obj.value.length == 5)
			Obj.value += '/'		//+ d.getFullYear();
	}
 }