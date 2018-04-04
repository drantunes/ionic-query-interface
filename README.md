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

## Insert

To insert new data in table `users`, you need to call the `insert` method. This method is an interface for `SQL insert statement`. Before the use of `insert` method, you need to call the `table` method to specify the table for insert. Example:

```javascript
async add() {
    let user = {
      name: 'John Doe',
      age: 10,
      amount: 1.6
	};
	// Fluent API for SQL Insert statement 
    let id = await this.db.table("users").insert(user);
    
    this.users.push({ id: id, ...user });
}
```

## Update 

The `update` method is an interface for the `SQL update statement`. Before to use `update` method, you need to call the `table` method to specify the table for update. The `data` passed as parameter in `update` should contain the `id` field, needed in `where` statement. Only fields passed in `data` will be updated in table. Example:

```javascript
async update() {
    let data = {
      id: 1,
      name: 'John Doing'
    };
	await this.db.table("users").update(data);
}
```

Another option is to use the `where` method for explicitly specify the condition for the `update`. Example: 

```javascript
async update() {
    let data = {
      name: 'John Doing'
    };
	await this.db.table("users").where("id = 1").update(data);
}
```

## Delete 

The `delete` method is an interface for the `SQL delete statement`. Before to use `delete` method, you need to call the `table` method to specify the table for data delete. The `data` passed as parameter in `delete` should contain the `id` field, needed in `where` statement. Example:

```javascript
async delete(id) {
    await this.db.table("users").delete({ id: 1 });
}
```

Another option is to use the `where` method for explicitly specify the condition for the `delete`. Example: 

```javascript
async delete(id) {
    await this.db.table("users").where(`id = ${id}`).delete();
}
```

## All

To select all data from a table. Example:

```javascript
async initUsers(){
    this.users = await this.db.table("users").all();
}
```

## Select

To select data from a table. Example:

```javascript
async select(id) {
    let results = await this.db.table("users").select({ id: 1 });
	this.user = results[0].name;
	this.age = results[0].age;
	...
}
```

## Where, And and Or

You can use a fluid interface combining `where` clausule with `and` / `or` methods. It's need to call `select` method at end. Example:

```javascript
async selectBy(){
    this.users = await this.db.table("users")
                              .where("amount >= 3")
                              .and()
                              .where("amount <= 5")
                              .or()
                              .where("amount = 1.5")
                              .select();

}
```

## API 

* **`open(db_name)`**: create or open a database connection with `db_name : <string>` provided. 

* **`createTable(table, schema)`**: create the `table : <string>` by `schema : <object>` provided, if not exists. The `schema` consists of an object that contains `key : value` pairs, where `key` is the column name and `value` is the column type (integer, real, text and null).

* **`table(name)`**: define the table name for insert | update | select | delete operations. The method return the instance for the chain.

* **`insert(data)`**: method for insert new `data : <object>` in a table. An interface for SQL insert statement. 

* **`update(data)`**: method for update a `data : <object>` in a table. An interface for SQL update statement. It's required that `data` contain the `id` field used in `where` clausule.

* **`delete(data)`**: method for delete a data by `id : <integer>` in a table. An interface for SQL delete statement. It's required that `data` contain the `id` field used in `where` clausule.

* **`select(data)`**: method for select data (optional) by `id : <integer>` in a table. An interface for SQL select statement with where clausule by `id`. This method return an array of table results. If `data` is not provided, then the method return all results of table.

* **`all()`**: return an array with all results of a table. 

* **`where(condition)`**: sets the `where` clausule for a SQL method for the `condition` provided. Returns the class instance for the chain.

* **`and()`**: sets the SQL `AND` condition to join two `where` clausule. Returns the class instance for the chain.

* **`or()`**: sets the SQL `OR` condition to join two `where` clausule. Returns the class instance for the chain.
