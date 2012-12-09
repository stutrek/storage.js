# Storage

This is a dead simple interface to localStorage that adds expiration dates. To use it simply request a key and provide an expiration date. You will receive an object that will automatically be saved to localStorage through the magic of the onbeforeunload event.

## Basic Usage

```javascript

requirejs(['./storage'], function( storage ) {
	
	var oneWeekFromNow = new Date().getTime() + (1000 * 60 * 60 * 24 * 7);
	
	var storageObject = storage.get( 'foo', oneWeekFromNow );
	
	storageObject.data = 'bar';
	
});

```

The next time you request a storage object with the key foo (as long as it's within the next week), its data attribute will be 'bar'.

The default expiration date is one year from the time the item is requested.