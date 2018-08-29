import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite } from '@ionic-native/sqlite';

const win: any = window;

export const isFunction = (val: any) => typeof val === 'function';
export const isObject = (val: any) => typeof val === 'object';
export const isArray = Array.isArray;

@Injectable({
    providedIn: 'root'
})
export class SqlProvider {

    static BACKUP_LOCAL = 2;
    static BACKUP_LIBRARY = 1;
    static BACKUP_DOCUMENTS = 0;
    private _db: any;
    public tableName = '';
    public whereClausule = '';

    constructor(public platform: Platform, public sqlite: SQLite) { }

    /** 
     * return the DB instance 
     */
    db() {
        return this._db;
    }

    /** 
     * Open a database connection in WebSQL or SQLite 
     * @param {string} db_name database name 
     */
    open(db_name: string = 'ionDatabase') {

        let dbOptions = this.defaults({}, {
            name: db_name,
            backupFlag: 2,
            existingDatabase: false
        });

        if (win.sqlitePlugin && this.platform.is('cordova')) {
            let location = this._getBackupLocation(dbOptions.backupFlag);

            this._db = win.sqlitePlugin.openDatabase(this.assign({
                name: dbOptions.name,
                location: location,
                createFromLocation: dbOptions.existingDatabase ? 1 : 0
            }, dbOptions));

        }
        else {
            console.warn('Storage: SQLite plugin not installed, falling back to WebSQL. Make sure to install cordova-sqlite-storage in production!');

            this._db = win.openDatabase(dbOptions.name, '1.0', 'database', 5 * 1024 * 1024);
        }
        this._tryInit();

        return this._db;
    }

    /** 
     * Create a SQL Table with your Structure (Scheme) 
     * All tables includes the id field with AutoIncrement 
     * @param {string} table name 
     * @param {object} structure 
     */
    async createTable(table: string, structure: object) {
        let schema = [];
        Object.keys(structure).forEach((key) => schema.push(`${key} ${structure[key]}`));
        return await this.query(`CREATE TABLE IF NOT EXISTS ${table}(id INTEGER PRIMARY KEY AUTOINCREMENT, ${schema.join()})`);
    }

    /**
     * Set table name
     * @param {string} name name of table
     */
    table(name: string) {
        this.tableName = name;
        return this;
    }

    /**
     * Reset table name after a query
     */
    resetTableName() {
        this.tableName = '';
    }

    /**
     * Reset where clausule after query
     */
    resetWhereClausule() {
        this.whereClausule = '';
    }

    /**
     * Prepare the where condition
     * @param {string} condition 
     */
    where(condition: string) {
        this.whereClausule = `${this.whereClausule} ${condition}`;
        return this;
    }

    /**
     * Add or clause in Where Condition
     */
    or() {
        this.whereClausule = `${this.whereClausule} OR `;
        return this;
    }

    /**
     * Add and clause in Where Condition
     */
    and() {
        this.whereClausule = `${this.whereClausule} AND `;
        return this;
    }

    /**
     * Check if table name was declared before a query
     */
    async checkTableName() {
        if (this.tableName === '' || this.tableName === null || this.tableName === undefined) {
            throw new Error("You need to set the 'table' name before insert method");
        }
        try {
            let results = await this.query(`SELECT * FROM ${this.tableName} LIMIT 1`);
        }
        catch(err) {
            throw new Error(`You need to create the ${this.tableName} schema first. Check the createTable method in documentation.`);
        }
    }

    /**
     * Check if data contains the id property (PK of each table) 
     * if user not provide a custom Where Clausule
     * @param {object} data properties of a table
     */
    checkIdField(data : object = {}) {
        if (!data.hasOwnProperty('id') && this.whereClausule === '') {
            throw new Error("You need to pass the 'id' key in data object");
        }
    }

    /**
     * INSERT SQL command in fluent interface way.
     * @param {object} data properties that will be recorded in a table
     */ 
    async insert(data: object) {

        this.checkTableName();

        let cols = [];
        let mask = [];
        let vals = [];

        Object.keys(data).forEach((key) => {
            cols.push(key);
            mask.push('?');
            vals.push(data[key]);
        });

        try {
            let response = await this.query(`INSERT INTO ${this.tableName} (${cols.join()}) VALUES (${mask.join()})`, vals);
            this.resetTableName();
            return response.res.insertId;
        }
        catch(err) {
            throw new Error(err);
        }
    }


    /**
     * UPDATE SQL command in fluent interface way. 
     * Only provide the properties that will be updated.
     * @param {any} data properties that will be updated in a table
     */
    async update(data: any) {

        this.checkTableName();
        this.checkIdField(data);

        let update = [];
        let vals = [];

        Object.keys(data).forEach((key) => {
            if (key !== 'id') {
                update.push(`${key} = ?`);
                vals.push(data[key]);
            }
        });

        let where = (this.whereClausule !== '') ? this.whereClausule : `id = ${data.id}`;

        try {
            let response = await this.query(`UPDATE ${this.tableName} SET ${update.join()} WHERE ${where}`, vals);
            this.resetWhereClausule();
            this.resetTableName();
            return response;
        }
        catch (err) {
            console.error(err);
        }

    }

    /**
     * SELECT * SQL command in fluent interface way.
     */
    async all() {

        this.checkTableName();

        let response = await this.query(`SELECT * FROM ${this.tableName}`);
        let rows = response.res.rows;
        let results = [];

        for (let index = 0; index < rows.length; index++) {
            results.push(rows.item(index));
        }
        this.resetTableName();
        return results;
    }

    /**
     * SELECT SQL command in fluent interface way.
     * The user can select all data, select by id 
     * or select using multiple where clausule
     * @param {object} data can contains the id field for Where clause
     */
    async select(data = null) {
        let clausule = '';
        this.checkTableName();

        if (this.whereClausule !== '') {
            clausule = `WHERE ${this.whereClausule}`;
        }
        else if (data !== null && this.whereClausule === '') {
            this.checkIdField(data);
            clausule = `WHERE id = ${data.id}`;
        }

        try {
            let response = await this.query(`SELECT * FROM ${this.tableName} ${clausule}`);
            this.resetWhereClausule();
            this.resetTableName();
            let rows = response.res.rows;
            let results = [];

            for (let index = 0; index < rows.length; index++) {
                results.push(rows.item(index));
            }

            return results;
        }
        catch (err) {
            console.error(err);
        }
    }

    /**
     * DELETE SQL in a fluent interface way.
     * User can provide a specific where clause.
     * @param {object} data can contain the id key used in delete
     */
    async delete(data = null) {
        this.checkTableName();
        let clausule = '';

        if (this.whereClausule !== '') {
            clausule = this.whereClausule;
        }
        else if (data !== null && this.whereClausule === '') {
            this.checkIdField(data);
            clausule = `id = ${data.id}`;
        }
        else {
            throw new Error("You need to set a WHERE clausule or pass the ID key in object as parameter");
        }

        try {
            let response = await this.query(`DELETE FROM ${this.tableName} WHERE ${clausule}`);
            this.resetWhereClausule();
            this.resetTableName();
            return response;
        }
        catch (err) {
            console.error(err);
        }
    }

    // Methods for old Ionic Storage Interface

    _getBackupLocation(dbFlag: number): number {
        switch (dbFlag) {
            case SqlProvider.BACKUP_LOCAL:
                return 2;
            case SqlProvider.BACKUP_LIBRARY:
                return 1;
            case SqlProvider.BACKUP_DOCUMENTS:
                return 0;
            default:
                throw Error('Invalid backup flag: ' + dbFlag);
        }
    }

    // Initialize the DB with our required tables 
    _tryInit() {
        this.query('CREATE TABLE IF NOT EXISTS kv (key text primary key, value text)').catch(err => {
            console.error('Storage: Unable to create initial storage tables', err.tx, err.err);
        });
    }

    /** 
     * Perform an arbitrary SQL operation on the database. Use this method 
     * to have full control over the underlying database through SQL operations 
     * like SELECT, INSERT, and UPDATE. 
     * 
     * @param {string} query the query to run 
     * @param {array} params the additional params to use for query placeholders 
     * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)} 
     */
    query(query: string, params = []): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this._db.transaction((tx) => {
                    tx.executeSql(query, params,
                        (tx, res) => resolve({ tx: tx, res: res }),
                        (tx, err) => reject({ tx: tx, err: err }));
                },
                    (err) => reject({ err: err }));
            } catch (err) {
                reject({ err: err });
            }
        });
    }

    /** 
     * Get the value in the database identified by the given key. 
     * @param {string} key the key 
     * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)} 
     */
    get(key: string): Promise<any> {
        return this.query('select key, value from kv where key = ? limit 1', [key]).then(data => {
            if (data.res.rows.length > 0) {
                return data.res.rows.item(0).value;
            }
        });
    }

    /** 
    * Set the value in the database for the given key. Existing values will be overwritten. 
    * @param {string} key the key 
    * @param {string} value The value (as a string) 
    * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)} 
    */
    set(key: string, value: string): Promise<any> {
        return this.query('insert or replace into kv(key, value) values (?, ?)', [key, value]);
    }

    /** 
    * Remove the value in the database for the given key. 
    * @param {string} key the key 
    * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)} 
    */
    remove(key: string): Promise<any> {
        return this.query('delete from kv where key = ?', [key]);
    }

    /** 
    * Clear all keys/values of your database. 
    * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)} 
    */
    clear(): Promise<any> {
        return this.query('delete from kv');
    }


    assign(...args: any[]): any {
        if (typeof (<any>Object).assign !== 'function') {
            // use the old-school shallow extend method 
            return this._baseExtend(args[0], [].slice.call(args, 1), false);
        }

        // use the built in ES6 Object.assign method 
        return (<any>Object).assign.apply(null, args);
    }

    /** 
     * Apply default arguments if they don't exist in 
     * the first object. 
     * @param the destination to apply defaults to. 
     */
    defaults(dest: any, ...args: any[]) {
        for (var i = arguments.length - 1; i >= 1; i--) {
            var source = arguments[i];
            if (source) {
                for (var key in source) {
                    if (source.hasOwnProperty(key) && !dest.hasOwnProperty(key)) {
                        dest[key] = source[key];
                    }
                }
            }
        }
        return dest;
    }

    _baseExtend(dst: any, objs: any, deep: boolean) {
        for (var i = 0, ii = objs.length; i < ii; ++i) {
            var obj = objs[i];
            if (!obj || !isObject(obj) && !isFunction(obj)) continue;
            var keys = Object.keys(obj);
            for (var j = 0, jj = keys.length; j < jj; j++) {
                var key = keys[j];
                var src = obj[key];

                if (deep && isObject(src)) {
                    if (!isObject(dst[key])) dst[key] = isArray(src) ? [] : {};
                    this._baseExtend(dst[key], [src], true);
                } else {
                    dst[key] = src;
                }
            }
        }

        return dst;
    }
}