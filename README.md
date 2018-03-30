# Ionic Query Interface! 
 
Hey everyone! This package provide support for old `query` method of Ionic Storage, that has deprecated in Ionic 3. In addition, the package provide a fluent interface to work with SQL in Ionic 3+ using the SQLite Native Plugin or WebSQL fallback if you are developing in browser environment.

## Installation 

Install the Cordova and Ionic Native plugins:
Read the documentation: https://ionicframework.com/docs/native/sqlite/

```
ionic cordova plugin add cordova-sqlite-storage
npm install --save @ionic-native/sqlite
```

Then, install the package: 

    npm install --save ionic-query-interface

## Configuration

In your `app.module.ts` import the `SqlProvider` and `SQLite` modules:

```javascript
import { SQLite } from '@ionic-native/sqlite';
import { SqlProvider } from 'ionic-query-interface';
```

Then,  add the `SqlProvider` and `SQLite` on `providers` array: 

```javascript
    ...
    providers:  [
	    SQLite,
	    SqlProvider,
	    ...
```

In the class that you want to use the SQLite database, just import the `SqlProvide` and inject in class constructor. All methods will be available in `this.db` property.

```javascript
import  { SqlProvider } from 'ionic-query-interface';
...
...
	constructor(public db : SqlProvider ...) {
````

## Methods

