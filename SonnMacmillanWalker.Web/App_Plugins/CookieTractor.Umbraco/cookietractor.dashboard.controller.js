(function () {
    'use strict';

    var controller = function ($http, $scope, notificationsService) {

        console.log('Load CookieTractor');

        var vm = this;
        vm.loading = true;
        vm.state = 'Overview';
        vm.data = undefined;
        vm.chart = undefined;

        vm.init = function () {

            console.log('CookieTractor Get Status');

            $http.get('/Umbraco/backoffice/CookieTractor/CookieTractor/GetStatus').then(function (res) {

                console.log(res);
                vm.data = res.data;
                vm.loading = false;

                vm.setupChart();
                vm.state = 'Overview';

            }, function(res) {

                console.log('err:',res);
                if (res && res.data && (res.data.errorType === 'MissingConfiguration')) {
                    vm.loading = false;
                    vm.state = 'MissingConfiguration';
                } 
                else {
                    console.log(data);
                    notificationsService.error('CookieTractor', 'Server errors, check the logs');
                }

            });

        }

        vm.init();

        vm.setupChart = function(){

            if(!vm.data.consentSummary)
                return;

            var data = [
                vm.data.consentSummary.allPercent,
                vm.data.consentSummary.statisticalPercent,
                vm.data.consentSummary.marketingPercent,
                vm.data.consentSummary.necessaryPercent
            ];

            vm.chart = {}
            vm.chart.labels = ['Accept all','Statistical only','Marketing only','Necessary only'];
            vm.chart.data = data;
            vm.chart.colors = ['#B4EA9F','#FFE682','#F4B9DE','#FFB482'];

            vm.chart.options = {
                responsive : true,
                maintainAspectRatio: true, // In this case we want to keep the circule round
                legend: {
                    // The clickable-boxes with series names
                    display: false,
                },
                tooltips: {
                    //mode: 'label',
                    callbacks: {
                        //Note: label is called for EACH series to create the label for the individual series/data point.
                        label: function(tooltipItem, data) {

                            var dataValue = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                            var label = data.labels[tooltipItem.index];

                            return label + ': ' + dataValue + '%';

                        }
                    }
                },
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 10,
                        bottom: 0
                    }
                },
                scales: {
                   
                }
            };

            this.chart.datasetOverride = {
                backgroundColor: ['#B4EA9F','#FFE682','#F4B9DE','#FFB482'],
                hoverBackgroundColor: ['#B4EA9F','#FFE682','#F4B9DE','#FFB482'],
                hoverBorderColor: ['#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF'],
            };

        }

    }

    angular.module('umbraco').controller('CookieTractor.Umbraco.DashboardController', ['$http','$scope','notificationsService',controller]);
})();
