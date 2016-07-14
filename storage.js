(function(factory) {

	//AMD
	if(typeof define === 'function' && define.amd) {
		define([], factory);

	//NODE
	} else if(typeof module === 'object' && module.exports) {
		module.exports = factory();

	//GLOBAL
	} else {
		window.storagejs = factory();
	}

})(function() {
	"use strict"
	var exports = {};
	
	var namespace = 'storage-';

	var localObjects = {};
	var sessionObjects = {};

	var localExpirationDates = JSON.parse( localStorage.getItem(namespace+'storageModuleExpirationDates') ) || {};
	var sessionExpirationDates = JSON.parse( sessionStorage.getItem(namespace+'storageModuleExpirationDates') ) || {};
	
	// turn expiration dates into Dates.
	for (var key in localExpirationDates) {
		localExpirationDates[key] = new Date( localExpirationDates[key] );
	}
	for (var key in sessionExpirationDates) {
		sessionExpirationDates[key] = new Date( sessionExpirationDates[key] );
	}

	// removeds a key from storage
	function expire( key, expirationObject, activeObjects, storageMethod ) {
		storageMethod.removeItem(key);
		delete expirationObject[key];
		delete activeObjects[key];
	}

	// checks expiration objects for expired data
	function checkExpirations( expirationObject, activeObjects, storageMethod ) {
		var now = new Date();
		for (var key in expirationObject) {
			if (expirationObject[key] < now) {
				expire( key, expirationObject, activeObjects, storageMethod );
			}
		}
	}
	function createNewObeject( key, expirationDateFromGet, expirationObject, activeObjects, storageMethod ) {
		function StorageObject( props ) {
			for( var key in props ) {
				this[key] = props[key];
			}
		}
		StorageObject.prototype.save = function( expirationDate ) {
			if (!expirationDate && expirationDateFromGet) {
				expirationDate = expirationDateFromGet;
			} else if (!expirationDate) {
				expirationDate = new Date().getTime() + (1000 * 60 * 60 * 24 * 365);
			}

			if (new Date() < expirationDate) {
				expirationObject[key] = expirationDate;
				storageMethod.setItem( namespace+'storageModuleExpirationDates', JSON.stringify(expirationObject) );
				storageMethod.setItem(key, JSON.stringify(activeObjects[key], function (k, v) {
					return activeObjects[key].hasOwnProperty(k);
				}));
			} else {
				expire( key, expirationObject, activeObjects, storageMethod );
			}
		};
		StorageObject.prototype.safeSave = function( expirationDate ) {
			try {
				this.save( expirationDate );
				return true;
			} catch (e) {
				return false;
			}
		};

		var parsed;
		try {
			parsed = JSON.parse(storageMethod.getItem(key));
		} catch (e) {
			parsed = {};
		}

		return new StorageObject( parsed );
	}

	function get( key, expirationDateFromGet, expirationObject, activeObjects, storageMethod ) {
		key = namespace+key;

		if (expirationDateFromGet) {
			expirationDateFromGet = new Date(expirationDateFromGet);
		}

		if (!activeObjects[key]) {
			activeObjects[key] = createNewObeject( key, expirationDateFromGet, expirationObject, activeObjects, storageMethod );
		}

		return activeObjects[key];
	}

	checkExpirations( localExpirationDates, localObjects, localStorage );
	checkExpirations( sessionExpirationDates, sessionObjects, sessionStorage );

	exports.get = function( key, expirationDate ) {
		return get( key, expirationDate, localExpirationDates, localObjects, localStorage );
	};

	exports.getSession = function( key, expirationDate ) {
		return get( key, expirationDate, sessionExpirationDates, sessionObjects, sessionStorage );
	};

	return exports;
});