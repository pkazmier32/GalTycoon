var app = angular.module('galtycoonApp', [])
	.controller('GalTycoonCtrl', ['$scope', '$interval', function ($scope, $interval) {
	
		$scope.gatherdrones = {cargo:0, cargoCapacity:100, status:"Docked"};
		var timer;
		
		var init = function () {
			// Initialize data from data store
			//$scope.gatherdrones.cargo=0;
			
			timer = $interval(function () {
				processTurn();
			}, 1000, 20);   // Run a maximum of 20 times for now
        }

		$scope.startTimer = function() {
			init();
		};
		
		function processTurn() {
			
			if ($scope.gatherdrones.cargo >= $scope.gatherdrones.cargoCapacity) {
				$scope.gatherdrones.cargo = $scope.gatherdrones.cargoCapacity;
				$scope.gatherdrones.status="Full";
			} else {
				$scope.gatherdrones.cargo+=10;
				$scope.gatherdrones.status="Gathering";
			}
		}
				
		$scope.stopTimer = function() {
			if (angular.isDefined(timer)) {
				$interval.cancel(timer);
			}
		}
	
		$scope.$on('$destroy', function () {
			// Make sure that the interval nis destroyed too
			if (angular.isDefined(timer)) {
				$interval.cancel(timer);
				timer = undefined;
			}

			if (angular.isDefined(autoSaveTimer)) {
				$interval.cancel(autoSaveTimer);
				autoSaveTimer = undefined;
			}
		});
	
	}]);