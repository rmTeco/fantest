vlocity.cardframework.registerModule.controller('taCareRadioButtonListCtrl', ['$scope', function($scope) {
    
    $scope.isArray = angular.isArray;
    
}]);

vlocity.cardframework.registerModule.filter("isArray", function() {
    return function(input) {
        return angular.isArray(input);
    };
});