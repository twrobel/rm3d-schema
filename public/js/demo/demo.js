var schema = []

	
var module = angular.module('demo', ['angular-table']);
module.factory('instrumentsSchemaService', function($http) {
	   return {
			getInstruments: function() {
				 return $http.get('http://rm3d-schema.herokuapp.com/collections/instruments');
			}
	   }
	});
module.controller('demoController', function($scope, instrumentsSchemaService) {
        $scope.selectedRow = {};
        $scope.listOfFields = [];
		
		

		$scope.getInstrumentFields = function(instrumentType){
			//$scope.foos = myService.getFoos().then(function(foos) {
			//	$scope.foos = foos;
			//});
			if(schema.length == 0 ){
				instrumentsSchemaService.getInstruments().success(function(users){	
					schema = users;
				});
			}
			 
			for(var i=0; i < schema.length; i++){
				if(schema[i]['type'] === instrumentType){
					return schema[i]['fields']
				}
			}
			return []
		}
        $scope.parsePosition = function() {
			var values = $scope.position.toLowerCase().split('|');
            $scope.listOfFields = [];
			var instrumentFields = $scope.getInstrumentFields(values[0]);
            for(var i = 0; i < instrumentFields.length; i++) {
                $scope.listOfFields.push({
                   pos: instrumentFields[i]['pos'],
                   name: instrumentFields[i]['name'],
                   value: values[i]
                });
            }
        };

        $scope.handleRowSelection = function(row) {
            $scope.selectedRow = row;
        };

    });
