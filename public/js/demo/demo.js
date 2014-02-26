var schema = []

$('[data-toggle="popover"]').popover({
    trigger: 'hover',
        'placement': 'top'
});
	
var module = angular.module('demo', ['ngRoute']);
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
	$scope.getInstrumentFields = function(instrumentType, values){
		if(schema[instrumentType] == undefined ){
			instrumentsSchemaService.getInstruments(instrumentType).success(function(instrument){	
				if(instrument['fields'] != undefined){
					$scope.updateFields(instrument['fields'], values);
				}
			});
		} else {
			$scope.updateFields(schema[instrumentType]['fields'], values)
		}
	}
	$scope.updateFields = function(instrumentFields, values){
		$scope.listOfFields = [];
		for(var i = 0; i < instrumentFields.length; i++) {
                	$scope.listOfFields.push({
                			pos: instrumentFields[i]['pos'],
                   			name: instrumentFields[i]['name'],
                   			req: instrumentFields[i]['req'],
                   			desc: instrumentFields[i]['desc'],
                   			type: instrumentFields[i]['type'],
                   			value: values[i]
                	});
	                $('[data-toggle="popover"]').popover({
				 trigger: 'hover',
	        		'placement': 'top',
	        		 html : true, 
			        content: function() {
			          return $('#'+instrumentFields[i]['pos']+'_popover_content_wrapper').html();
			        }
			});
            	}
            	
	}
        $scope.parsePosition = function() {
		var values = $scope.position.split('|');
            	$scope.getInstrumentFields(values[0].toLowerCase(), values);
        };

        $scope.handleRowSelection = function(row) {
            $scope.selectedRow = row;
        };

    });
