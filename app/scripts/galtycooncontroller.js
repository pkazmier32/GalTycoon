var app = angular.module('galtycoonApp', [])
	.controller('GalTycoonCtrl', ['$scope', '$interval', function ($scope, $interval) {
	
		$scope.gatherdrones = [
			{id:"GatherDroneOne", base:"outpostOne", cargoLoaded:0, cargoCapacity:50, status:"Docked", maxspeed:5, range:50, distance:0, cargo:[{"type":"Ice", "amount":0},{"type":"C-Type", "amount":0}, {"type":"S-Type","amount":0}]}
			
			//{id:"GatherDroneTwo", cargo:0, cargoCapacity:100, status:"Docked", maxspeed:5, range:100, distance:0, cargo=[{"item":"ice", "amount":0}]}
		];
		
		
		$scope.outposts = [
			{id:"outpostOne", storageCapacity:300, materials:[{"type":"C-Type","amount":50},{"type":"S-type","amount":0}, {"type":"Ice","amount":0}],	droneCapacity:5, processors:[{"rawmaterial":"C-Type","number":1}, {"rawmaterial":"S-type", "number":1} ]}
		];
/*		
		$scope.processedmaterials = [
			{"input:C-Type", outputs=[{"item":"Carbon", amount:5}, {"item":"Basic Metals", "amount":1}, {"item":"water", "amount":1}]}
		];
*/
			
		var timer;
		
		var init = function () {
			// Initialize data from data store
			//$scope.gatherdrones.cargo=0;
			
			timer = $interval(function () {
				processTurn();
			}, 1000, 0);   // Run a maximum of 20 times for now
        }

		$scope.startTimer = function() {
			init();
		};
		
		function processDrone (drone) {
			console.log("Drone: " + drone.id + " Status: " + drone.status + " Distance: " + drone.distance + " Cargo Loaded: " + drone.cargoLoaded);
			if (drone.status == "Gathering") {
				if (drone.distance <= drone.range) {
					drone.distance += drone.maxspeed;
					if (drone.cargoLoaded >= drone.cargoCapacity) {
						drone.cargoLoaded = drone.cargoCapacity;
						drone.status="Returning";
					} else {
						var itm = Math.floor(Math.random() * 6);   // returns a random number between 0 and 2
						drone.cargoLoaded+=5;
						angular.forEach(drone.cargo, function (item, type) {
							console.log("Itm: " +itm+ " Drone: " + drone.id + " Cargo item: " + item.type + " amount: " + item.amount);
							if (itm <=3) {  //itm = "Ice"
								if (item.type == "Ice") 
									item.amount += 5;
							} else if (itm == 4) { //itm = "C-Type"
								if (item.type == "C-Type")
									item.amount += 5;
							}
							else if (itm == 5) { //itm = "S-Type"
								if (item.type == "S-Type") 
									item.amount += 5;
							}
						});
					}
				} else {
					drone.status="Returning";
				}
			} else if (drone.status == "Returning") {
				if (drone.distance <= 0) {
					drone.status = "Unloading"
				} else {
					drone.distance -= drone.maxspeed;
				}
			} else if (drone.status == "Unloading") {
				drone.status = "Docked";
				drone.cargoLoaded=0;
				drone.distance=0;
				angular.forEach(drone.cargo, function (item, type) {
					if (item.type == "Ice") 
						item.amount=0;
					else if (item.type == "C-Type")
						item.amount=0;
					else if (item.type == "S-Type")
						item.amount=0;
				});
				
			} else if (drone.status == "Docked") {
				drone.status = "Gathering";
			}
			
		}
		
		function processTurn() {
			angular.forEach($scope.gatherdrones, function (drone, droneid) {
				processDrone(drone);
			}); 	
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