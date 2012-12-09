define(function( require, exports, module ) {
	"use strict"
	
	var namespace = 'storage-';
	
	// load previously saved objects
	var storageObjects = JSON.parse( localStorage.getItem(namespace+'-data') ) || {};
	var expirationDates = JSON.parse( localStorage.getItem(namespace+'-expirationDates') ) || {};
	
	// convert date to Date object, delete expired objects
	var now = new Date();
	for (var key in storageObjects) {
		expirationDates[key] = new Date( expirationDates[key] );
		if (expirationDates[key] < now) {
			delete storageObjects[key];
			delete expirationDates[key];
		}
	}
	
	function saveAll() {
		var now = new Date().getTime();
		for (var key in storageObjects) {			
			if (expirationDates[key] < now) {
				delete storageObjects[key];
				delete expirationDates[key];
			}
		}
		localStorage.setItem(namespace+'-data', JSON.stringify(storageObjects))
		localStorage.setItem(namespace+'-expirationDates', JSON.stringify(expirationDates))
	}
	
	try {
		window.addEventListener( 'beforeunload', saveAll, true );
	} catch(e) {
		window.attachEvent( 'onbeforeunload', saveAll );
	}
	
	exports.get = function( key, expirationDate ) {
		
		if (!expirationDate) {
			expirationDate = new Date().getTime() + (1000 * 60 * 60 * 24 * 365)
		}
	
		expirationDate = new Date(expirationDate);
		
		if (!storageObjects[key] || expirationDates[key] < new Date() ) {
			storageObjects[key] = {};
		}
		expirationDates[key] = expirationDate;
		
		return storageObjects[key];
	};
	
	exports.getExpirationDate = function( key ) {
		return expirationDates[key]
	};
	
	exports.save = saveAll;
});