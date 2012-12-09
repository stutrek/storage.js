# Storage

This is a simple interface to localStorage that adds expiration dates. To use it simply request a key and provide an expiration date and you will receive an object that you can extend with JSONable properties.

Storage objects are saved to localStorage on the [beforeUnload event](https://developer.mozilla.org/en-US/docs/DOM/window.onbeforeunload). Unless the browser crashes or the power goes out your data will be safe until it expires.

The default expiration date is one year from the time the item is requested.

## Basic Usage

```javascript
requirejs(['./storage'], function( storage ) {
	
	var oneWeekFromNow = new Date().getTime() + (1000 * 60 * 60 * 24 * 7);
	
	var storageObject = storage.get( 'foo', oneWeekFromNow );
	console.log(storageObject) // {}
	
	storageObject.data = 'bar';
	console.log(storageObject) // { "data":"bar" }

});
```

Then, after a reload:

```javascript
requirejs(['./storage'], function( storage ) {
	
	var oneWeekFromNow = new Date().getTime() + (1000 * 60 * 60 * 24 * 7);
	
	var storageObject = storage.get( 'foo', oneWeekFromNow );
	console.log(storageObject) // { "data":"bar" }

});
```

## A Little More

Storage objects have no methods or properties, but the storage module does.

```javascript
requirejs(['./storage'], function( storage ) {
	
	storage.get( "key", expirationDate ); // gets or creates a new storage object
	storage.getExpirationDate( "key" ); // returns a date object representing the expiration date of the key.
	storage.save(); // saves all storage objects. Use to prevent data loss if you have a long running app.
	
});
```
