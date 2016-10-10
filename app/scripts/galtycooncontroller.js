var app = angular.module('galtycoonApp', [])
	.controller('GalTycoonCtrl', ['$scope', '$interval', function ($scope, $interval) {
	
		gatherdrones = [
			{id:"GatherDroneOne", base:"outpostOne", cargoLoaded:0, cargoCapacity:20, status:"Docked", maxspeed:5, range:10, distance:0, cargo:[{"type":"Ice", "amount":0},{"type":"C-Type", "amount":0}, {"type":"S-Type","amount":0}]},
			{id:"GatherDroneAlpha", base:"outpostTwo", cargoLoaded:0, cargoCapacity:30, status:"Docked", maxspeed:5, range:50, distance:0, cargo:[{"type":"Ice", "amount":0},{"type":"C-Type", "amount":0}, {"type":"S-Type","amount":0}]}
			
			//{id:"GatherDroneTwo", cargo:0, cargoCapacity:100, status:"Docked", maxspeed:5, range:100, distance:0, cargo=[{"item":"ice", "amount":0}]}
		];
		
		
		outposts = [
			{id:"outpostOne", storageCapacity:100, stored:0, status:"Ready", materials:[{"type":"C-Type","amount":50},{"type":"S-Type","amount":0}, {"type":"Ice","amount":0}],	droneCapacity:5, processors:[{"rawmaterial":"C-Type","number":1}, {"rawmaterial":"S-type", "number":1} ]},
			{id:"outpostTwo", storageCapacity:300}
		];
		
		
/*		
		$scope.processedmaterials = [
			{"input:C-Type", outputs=[{"item":"Carbon", amount:5}, {"item":"Basic Metals", "amount":1}, {"item":"water", "amount":1}]}
		];
*/
		$scope.outposts = outposts;
		var gatherdrone_timer;
		
		function getGDroneByBase(obj) {
			if (obj.id != undefined && obj.base == $scope.selectedOutpost)
				return true;
		}
		
		function getOutpostById(obj) {
			if (obj.id != undefined && obj.id == $scope.selectedOutpost)
				return true;
		}
		
		var init_gatherdrones = function () {
			// Initialize data from data store
			
			gatherdrone_timer = $interval(function () {
				processGatherDroneTurn();
			}, 1000, 0);   // Run until stopped
        }
		
		$scope.outpostSelected = function() {
			console.log("Selected outpost: " + $scope.selectedOutpost);
			
			$scope.gatherdrones = gatherdrones.filter(getGDroneByBase);
			
			$scope.outpost = outposts.filter(getOutpostById);
			$scope.outpost[0].stored = $scope.outpost[0].materials.sum("amount");
			var op = $scope.outpost;
			
			console.log("Outpost: " + op[0].id + " " + op[0].materials.sum("amount"));
			
		}

		$scope.startGDTimer = function() {
			init_gatherdrones();
		};
		
		Array.prototype.sum = function (prop) {
			var ttl=0;
			for (var i=0,_len = this.length; i < _len; i++) {
				ttl += this[i][prop]
			}
			return ttl;
		}
		
		function processDrone (drone, outpost) {
			//console.log("OP storage: " + outpost.materials.sum("amount"));
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
							if (itm <=2) {  //itm = "Ice"
								if (item.type == "Ice") 
									item.amount += 5;
							} else if (itm == 4 || itm == 3) { //itm = "C-Type"
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
					//var obj = outpost.materials.filter(function(elem) {return elem.type == item.type;});
					//console.log("obj: " + obj);
					
					if (item.type == "Ice") {
						outpost.materials.filter(function(elem) {return elem.type == item.type;})[0].amount += item.amount;
						item.amount=0;
					}
					else if (item.type == "C-Type") {
						outpost.materials.filter(function(elem) {return elem.type == item.type;})[0].amount += item.amount;
						item.amount=0;
					}
					else if (item.type == "S-Type") {
						outpost.materials.filter(function(elem) {return elem.type == item.type;})[0].amount += item.amount;
						item.amount=0;
					}
				});
				outpost.stored = outpost.materials.sum("amount");
				
			} else if (drone.status == "Docked") {
				drone.status = "Gathering";
			}
			
		}
		
		function processGatherDroneTurn() {
			
			if ($scope.outpost[0].stored <= $scope.outpost[0].storageCapacity) {
				$scope.outpost[0].status="Ready";
				angular.forEach($scope.gatherdrones, function (drone, droneid) {
					processDrone(drone, $scope.outpost[0]);
				}); 
			} else {
				$scope.outpost[0].status="Storage Full";
			}
		}
				
		$scope.stopGDTimer = function() {
			if (angular.isDefined(gatherdrone_timer)) {
				$interval.cancel(gatherdrone_timer);
			}
		}
	
		$scope.$on('$destroy', function () {
			// Make sure that the interval nis destroyed too
			if (angular.isDefined(gatherdrone_timer)) {
				$interval.cancel(gatherdrone_timer);
				gatherdrone_timer = undefined;
			}

			if (angular.isDefined(autoSaveTimer)) {
				$interval.cancel(autoSaveTimer);
				autoSaveTimer = undefined;
			}
		});
	
	}]);