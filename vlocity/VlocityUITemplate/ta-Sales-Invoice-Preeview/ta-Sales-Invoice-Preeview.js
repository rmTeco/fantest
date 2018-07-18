vlocity.cardframework.registerModule.controller('InvoiceController', ['$scope', '$filter', function ($scope, $filter) {

	var vm = this;
	var bpTree = $scope.bpTree;
	
    vm.taxes = [];
	vm.items = [];
	vm.totalBeforeTaxes = 0;
	vm.totalTaxes = 0;
	vm.total = 0;
	activate();

	function activate() {
		var order = bpTree.response.BillingOrder;
        console.info("bpTree: ", bpTree)
		if (order.Items) {
			vm.items = angular.isArray(order.Items) ? order.Items : [order.Items];
		}
		if (bpTree.response.S013_Response.IPResult.calculoImpuestosRespuesta)
			vm.taxes = bpTree.response.S013_Response.IPResult.calculoImpuestosRespuesta.infoResCalculoImpuestos;

		// fillTaxes();
		calculateTotals();
	}

	function calculateTotals() {

		vm.totalTaxes = 0;
		vm.totalBeforeTaxes = 0;
		
		for (var i = 0; i < vm.taxes.length; i++) {
		    
			for (var j = 0; j < vm.taxes[i].impuestoxItemInfo.listaInfoImpuestos.length; j++) {
				tax = vm.taxes[i].impuestoxItemInfo.listaInfoImpuestos[j].infoImpuesto;
					// item.TaxesHuawei.push({
					// 	TaxAmount: parseFloat(tax.montoImpuesto),
					// 	BaseAmount: parseFloat(tax.montoBase),
					// 	Percentage: parseFloat(tax.porcentaje),
					// 	Type: tax.tipoImpuesto
					// });
				vm.totalTaxes += parseFloat(tax.importeImpuestoAplicado - tax.precioBase);
				// vm.totalTaxes += parseFloat(tax.alicuotaImpuesto);
				vm.totalBeforeTaxes += parseFloat(tax.precioBase);
			}
			
		}
		console.info("vm.totalTaxes: ", vm.totalTaxes);
		console.info("vm.totalBeforeTaxes: ", vm.totalBeforeTaxes);
        var cftInterest = 0;
		if (bpTree.response.CalculateInterest_Response && bpTree.response.CalculateInterest_Response.Interest && bpTree.response.CalculateInterest_Response.Interest > 0)
			cftInterest = bpTree.response.CalculateInterest_Response.Interest;

		vm.total = parseFloat(vm.totalTaxes) + parseFloat(vm.totalBeforeTaxes) + parseFloat(cftInterest);

	}
}]);