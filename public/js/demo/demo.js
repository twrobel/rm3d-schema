var schema = []


var module = angular.module('demo', ['ngRoute', 'ngAnimate', 'ngSanitize', 'mgcrea.ngStrap']);
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
                	var pos = instrumentFields[i]['pos'];
	                $('[data-toggle="' + pos + '_popover"]').popover({
				 trigger: 'hover',
	        		'placement': 'top',
	        		 html : true, 
			        content: function() {
			          return $('#'+pos+'_popover_content_wrapper').html();
			        }
			});
			
			var popoverContent = "<div><b>Type:</b> {{row.type}}" +
	            	"</div>"
	            	"<div>" +
	            	"<b>Required:</b> {{row.req}}" +
	            	"</div>" +	
	            	"<div>" +
	            	"<b>Description:</b> {{row.desc}}" +
	            	"</div>";
	            	$scope['popover_' + instrumentFields[i]['pos']] = {
				trigger: 'hover',
	        		'placement': 'top',
	        		 html : true, 
				  "content": popoverContent
				};
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
