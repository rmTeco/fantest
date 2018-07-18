vlocity
    .cardframework
    .registerModule
    .controller('MultiPaymentMethodController', MultiPaymentMethodController);
    
    MultiPaymentMethodController.$inject = ['$scope', '$filter'];
    function MultiPaymentMethodController($scope, $filter) {
        var mpmc = this;
        var bpTree = $scope.bpTree;
        var taxes = [];
        var PaymentMethodLimit = 1;
        
        //mpmc variables
        mpmc.items = [];
        mpmc.totalBeforeTaxes = 0;
        mpmc.totalTaxes = 0;
        mpmc.total = 0;
        mpmc.disableAddPaymentMethod = false;

        //mpmc functions
        mpmc.init = init;
        mpmc.addPaymentMethod = addPaymentMethod;
        mpmc.getCardsByBank = getCardsByBank;
        mpmc.getInstallmentsByCard = getInstallmentsByCard;


        // "PaymentMethod": {
        //     "PaymentMethods": [
        //       {
        //         "PaymentMethodRadio": "Debito a Proxima Factura",
        //         "DPFData": {
        //           "DPFInstallments": 1
        //         }
        //       }
        //     ]
        //   }

        function init() {
            mpmc.PaymentMethodQuantity = parseInt($scope.bpTree.response.PaymentMethodQuantity, 10);

            // $scope.$watch('bpTree.response.PaymentMethod', function(newVal, oldVal) {
            //     if ($scope.bpTree.response.PaymentMethod) {
            //         // mpmc.PaymentMethod = {
            //         //     PaymentMethods = []
            //         // }
            //     }
            // });

            // mpmc.PaymentMethod = {
            //     PaymentMethods = []
            // }
            

            activate();
            getPaymentMethod();
            getBankEntity();
        }

        function getPaymentMethod() {
            Visualforce.remoting.Manager.invokeAction(
                "taOrderController.GetPaymentMethods", $scope.bpTree.response,
                        function(result) {
                            mpmc.medioDePagos = result.options;
                        },
                {escape: false} // No escaping, please
            );
        }

        function getBankEntity() {
            Visualforce.remoting.Manager.invokeAction(
                "taOrderController.PopulateEntidades", $scope.bpTree.response,
                        function(result) {
                            console.info('BANKS: ', result.options);
                            mpmc.entidadesBancarias = result.options;
                        },
                {escape: false} // No escaping, please
            );
        }

        function getCardsByBank() {
            console.info ('Bank Selected: ', mpmc.entidadBancariaSelected);

            Visualforce.remoting.Manager.invokeAction(
                "taOrderController.GetCardsByBank", mpmc.entidadBancariaSelected,
                        function(result) {
                            console.info('Tarjetas: ', result.options);
                            mpmc.tarjetasPorBanco = result.options;
                            $scope.$apply();
                        },
                {escape: false} // No escaping, please
            );
        }

        function getInstallmentsByCard() {
            console.info('Tarjeta Selected and Bank Selected: ', mpmc.entidadBancariaSelected, "_", mpmc.tarjetaSelected);

            Visualforce.remoting.Manager.invokeAction(
                "taOrderController.GetInstallmentsByCard", mpmc.entidadBancariaSelected, mpmc.tarjetaSelected,
                        function(result) {
                            console.info('Cuotas: ', result.options);
                            mpmc.cuotasPorTarjetaYBanco = result.options;
                            // $scope.$apply();
                        },
                {escape: false} // No escaping, please
            );
        }

        function activate() {
            var order = bpTree.response.BillingOrder || {};

            if (order.Items) {
                mpmc.items = angular.isArray(order.Items) ? order.Items : [order.Items];
            }
            
            if (bpTree.response.S013_Response)
                taxes = bpTree.response.S013_Response.InfoResCalculoImpuestos.ImpuestoxItemInfo;

            // fillTaxes();
            calculateTotals();
        }

        function calculateTotals() {
            var cftInterest = 0;

            for (var l = 0; l < mpmc.items.length; l++) {
                var item = mpmc.items[l];
                mpmc.totalBeforeTaxes += item.UnitPrice * item.Quantity;
            }

            console.info('1', taxes);
            mpmc.totalTaxes = 0;
            for (var i = 0; i < taxes.length; i++) {
                for (var j = 0; j < taxes[i].infoImpuestos.length; j++) {
                    for (var k = 0; k < taxes[i].infoImpuestos[j].infoImpuestos.length; k++) {
                        tax = taxes[i].infoImpuestos[j].infoImpuestos[k];
                        mpmc.totalTaxes += tax.montoImpuesto;
                    }
                }
            }

            console.info('2');
            if (bpTree.response.CalculateInterest_Response && bpTree.response.CalculateInterest_Response.Interest && bpTree.response.CalculateInterest_Response.Interest > 0)
                cftInterest = bpTree.response.CalculateInterest_Response.Interest;

            // mpmc.total = parseFloat(mpmc.totalTaxes) + parseFloat(mpmc.totalBeforeTaxes) + parseFloat(cftInterest);
            mpmc.total = 3000;

        }

        // retorna un nodo ImpuestoxItemInfo
        function findHuawei(idItem) {
            var huawei = bpTree.response.S013_Response;
            var ret = null;
            var arr = huawei.InfoResCalculoImpuestos.ImpuestoxItemInfo;

            for (var i = 0; i < arr.length; i++) {
                if (arr[i].idItem === idItem) {
                    ret = arr[i];
                    break;
                }
            }

            return ret;
        }

        function addPaymentMethod() {
            PaymentMethodLimit++;
            if (PaymentMethodLimit > mpmc.PaymentMethodQuantity) {
                mpmc.disableAddPaymentMethod = true;
                return;
            }

            var taPaymentMethodContainer = angular.element( document.querySelector( '.taPaymentMethodContainer' ) );
            var taPaymentMethodForm = angular.element( document.querySelector( '.taPaymentMethodForm'   ) );
            taPaymentMethodContainer.append(taPaymentMethodForm.clone(true));
        }
    }