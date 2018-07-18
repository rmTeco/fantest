$(document).ready(function() {
var select=document.getElementById('SearchClientDocumentType');

for (i=0;i<select.length;  i++) {
   if (select.options[i].value=='PAS') {
     select.remove(i);
   }
}

});