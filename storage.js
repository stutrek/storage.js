define(function( require, exports, module ) {
	
	var namespace = 'storage-data';
	
	// load previously saved objects
	var storageObjects = JSON.parse( localStorage.getItem(namespace) ) || {};
	
	// convert date to Date object, delete expired objects
	var now = new Date();
	for (key in storageObjects) {
		var storageObj = storageObjects[key];
		storageObj.expirationDate = new Date( storageObj.expirationDate );
		if (storageObj.expirationDate < now) {
			delete storageObjects[key];
		}
	}
	
	function saveAll() {
		var now = new Date().getTime();
		for (var key in storageObjects) {
			var storageObj = storageObjects[key];
			
			if (storageObj.expirationDate < now) {
				delete storageObjects[key]	
			}
		}
		localStorage.setItem(namespace, JSON.stringify(storageObjects))
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
		
		var storageObj = storageObjects[key];
		
		if (!storageObj || storageObj.expirationDate < new Date() ) {
			storageObj = {
				expirationDate: expirationDate
			};
			storageObjects[key] = storageObj;
		} else {
			storageObj.expirationDate = expirationDate;
		}
		
		return storageObj;
	};
	
	exports.save = saveAll;
});