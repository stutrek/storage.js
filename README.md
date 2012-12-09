# Storage

This is a simple interface to localStorage that adds expiration dates. To use it simply request a key and provide an expiration date and you will receive an object that you can extend with JSONable properties.

## Basic Usage

```javascript

requirejs(['./storage'], function( storage ) {
	
	var oneWeekFromNow = new Date().getTime() + (1000 * 60 * 60 * 24 * 7);
	
	var storageObject = storage.get( 'foo', oneWeekFromNow );
	console.log(storageObject) // { "expirationDate":"2012-12-16T20:27:23.622Z" }
	
	storageObject.data = 'bar';
	console.log(storageObject) // { "data":"bar", "expirationDate":"2012-12-16T20:27:23.622Z" }
	
});

```

Storage objects are saved to localStorage on the [beforeUnload event](https://developer.mozilla.org/en-US/docs/DOM/window.onbeforeunload). Unless the browser crashes or the power goes out your data will be safe until it expires.

The default expiration date is one year from the time the item is requested.