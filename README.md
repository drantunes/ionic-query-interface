# Ionic Query Interface! 
 
Hey everyone! This package provide support for old `query` method of Ionic Storage, that has deprecated in Ionic 3. In addition, the package provide a fluent interface to work with SQL in Ionic 3+ using the SQLite Native Plugin or WebSQL fallback if you are developing in browser environment. You can work with `promises` or `async/await`.

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

In the class that you want to use the SQLite database, just import the `SqlProvider` and inject in class constructor. All methods will be available in `this.db` property.

```javascript
import  { SqlProvider } from 'ionic-query-interface';
...
...
	constructor(public db : SqlProvider ...) {
````

## Methods

First, in constructor, you need to open a database connection using the database name. You need call the `open` method, passing the DB name as parameter. Then, this package will create or open a connection with the database name provided. For example: 

```javascript
constructor(public db: SqlProvider) {    
	this.db.open("my_database");
	this.defineTable();
}
```

Also, you need to specify the table schema after DB opened. The method `createTable` accepts the table name and an object with table scheme. All tables schemes automatically includes a `id` field as primary key with auto-increment. Example: 

```javascript
async defineTable(){
    await this.db.createTable("users", {
      name: "text",
      age: "integer", 
      amount: "real"
    });
  }
```


## API 

* **`open(db_name)`**: create or open a database connection with `db_name : <string>` provided. 
* **`createTable(table, schema)`**: create the `table : <string>` by `schema : <object>` provided, if not exists. The `schema` consists of an object that contains `key : value` pairs, where `key` is the column name and `value` is the column type (integer, real, text and null).


