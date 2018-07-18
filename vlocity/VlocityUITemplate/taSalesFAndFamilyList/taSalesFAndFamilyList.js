vlocity
    .cardframework
    .registerModule
    .controller('FAndFController', FAndFController);
  
    FAndFController.$inject = ['$scope'];
    function FAndFController($scope){
        var fafc = this;
        
        fafc.validateTelecomNumber = validateTelecomNumber;
        fafc.showError = false;
        
        function validateTelecomNumber(lineNumber, spinnerName, showErrorMsg, numeroAmigoVozValidated) {
            fafc[spinnerName] = true;
            fafc[showErrorMsg] = false;
            
            Visualforce.remoting.Manager.invokeAction('taOrderController.ValidateTelecomNumber',lineNumber, 
                function(result, event) {  
                    fafc[spinnerName] = false;
                    numeroAmigoVozValidated.validated = result;
                    fafc[showErrorMsg] = !result;
                    $scope.$apply();
                }, 
                {escape: false, buffer: false}
            );
        }
    }