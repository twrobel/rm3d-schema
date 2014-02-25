var schema = []

	
var module = angular.module('demo', ['angular-table']);
module.factory('instrumentsSchemaService', function($http) {
	   return {
			getInstruments: function(instrumentType) {
				 return $http.get('http://rm3d-schema.herokuapp.com/collections/instruments/type/'+instrumentType);
			}
	   }
	});
module.controller('demoController', function($scope, instrumentsSchemaService) {
        $scope.selectedRow = {};
        $scope.listOfFields = [];
	$scope.getInstrumentFields = function(instrumentType){
		if(schema[instrumentType] == undefined ){
			instrumentsSchemaService.getInstruments(instrumentType).success(function(instrument){	
				if(instrument['fields'] != undefined){
					$scope.updateFields(instrument['fields']);
				}
			});
		}
		return $scope.updateFields(schema[instrumentType]['fields'])
	}
	$scope.updateFields() = function(instrumentFields){
		$scope.listOfFields = [];
		for(var i = 0; i < instrumentFields.length; i++) {
                	$scope.listOfFields.push({
                			pos: instrumentFields[i]['pos'],
                   			name: instrumentFields[i]['name'],
                   			value: values[i]
                	});
            	}
	}
        $scope.parsePosition = function() {
		var values = $scope.position.toLowerCase().split('|');
            	$scope.getInstrumentFields(values[0]);
        };

        $scope.handleRowSelection = function(row) {
            $scope.selectedRow = row;
        };

    });
