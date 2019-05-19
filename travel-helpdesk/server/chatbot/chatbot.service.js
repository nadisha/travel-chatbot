'use strict'

var request = require('request'); 

const endpoint = 'http://localhost:9966/api/travel/ontology';

exports.getDestinationsByCity = function(city, callback) {
	var url = endpoint + '/destinations?city=' + city;
	var options = {
		url: url,
		method: "GET",
		headers: {
			'X-Requested-With': 'XMLHttpRequest',
			'Content-type': 'application/json'
        }
	};	
	
	request(options, function(error, response, body) {        
		callback(JSON.parse(body));	
	});	    
}

exports.getDestinationByName = function(name, callback) {
	var url = endpoint + '/destinations/details?name=' + name;
	var options = {
		url: url,
		method: "GET",
		headers: {
			'X-Requested-With': 'XMLHttpRequest',
			'Content-type': 'application/json'
        }
	};
	request(options, function(error, response, body) {        
		callback(JSON.parse(body));	
	});	 		
}