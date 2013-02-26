# Storage

This  interface to localStorage and sessionStorage that adds expiration dates. To use it simply request a key and provide an expiration date and you will receive an object that you can extend with JSONable properties. Call the `save` method on the object it provides to save your data to localStorage or sessionStorage.

The default expiration date is one year from the time the item is requested. Expired keys will be deleted on the next page load.

## Basic Usage

```javascript
requirejs(['./storage'], function( storage ) {
	
	var oneWeekFromNow = new Date().getTime() + (1000 * 60 * 60 * 24 * 7);
	
	var storageObject = storage.get( 'foo', oneWeekFromNow );
	console.log(storageObject) // { "save": function(){...} }
	
	storageObject.data = 'bar';
	console.log(storageObject); // { "data":"bar", "save": function(){...} }

	storageObject.save();

});
```

Then, after a reload:

```javascript
requirejs(['./storage'], function( storage ) {
	
	var oneWeekFromNow = new Date().getTime() + (1000 * 60 * 60 * 24 * 7);
	
	var storageObject = storage.get( 'foo', oneWeekFromNow );
	console.log(storageObject) // { "data":"bar", "save": function(){...} }

});
```

## Storage Module Methods

* `storage.get( key, expirationDate )` - gets an object from localStorage
* `storage.getSession( key, expirationDate )` - gets an object from sessionStorage

## Storage Objects

* `storageObject.save()` - saves the data on this storage object to localStorage or sessionStorage.
