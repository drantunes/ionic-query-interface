var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite } from '@ionic-native/sqlite';
var win = window;
export var isFunction = function (val) { return typeof val === 'function'; };
export var isObject = function (val) { return typeof val === 'object'; };
export var isArray = Array.isArray;
var SqlProvider = /** @class */ (function () {
    function SqlProvider(platform, sqlite) {
        this.platform = platform;
        this.sqlite = sqlite;
        this.tableName = '';
        this.whereClausule = '';
    }
    SqlProvider_1 = SqlProvider;
    /**
     * return the DB instance
     */
    SqlProvider.prototype.db = function () {
        return this._db;
    };
    /**
     * Open a database connection in WebSQL or SQLite
     * @param {string} db_name database name
     */
    SqlProvider.prototype.open = function (db_name) {
        if (db_name === void 0) { db_name = 'ionDatabase'; }
        var dbOptions = this.defaults({}, {
            name: db_name,
            backupFlag: 2,
            existingDatabase: false
        });
        if (win.sqlitePlugin && this.platform.is('cordova')) {
            var location_1 = this._getBackupLocation(dbOptions.backupFlag);
            this._db = win.sqlitePlugin.openDatabase(this.assign({
                name: dbOptions.name,
                location: location_1,
                createFromLocation: dbOptions.existingDatabase ? 1 : 0
            }, dbOptions));
        }
        else {
            console.warn('Storage: SQLite plugin not installed, falling back to WebSQL. Make sure to install cordova-sqlite-storage in production!');
            this._db = win.openDatabase(dbOptions.name, '1.0', 'database', 5 * 1024 * 1024);
        }
        this._tryInit();
        return this._db;
    };
    /**
     * Create a SQL Table with your Structure (Scheme)
     * All tables includes the id field with AutoIncrement
     * @param {string} table name
     * @param {object} structure
     */
    SqlProvider.prototype.createTable = function (table, structure) {
        return __awaiter(this, void 0, void 0, function () {
            var schema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = [];
                        Object.keys(structure).forEach(function (key) { return schema.push(key + " " + structure[key]); });
                        return [4 /*yield*/, this.query("CREATE TABLE IF NOT EXISTS " + table + "(id INTEGER PRIMARY KEY AUTOINCREMENT, " + schema.join() + ")")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Set table name
     * @param {string} name name of table
     */
    SqlProvider.prototype.table = function (name) {
        this.tableName = name;
        return this;
    };
    /**
     * Reset table name after a query
     */
    SqlProvider.prototype.resetTableName = function () {
        this.tableName = '';
    };
    /**
     * Reset where clausule after query
     */
    SqlProvider.prototype.resetWhereClausule = function () {
        this.whereClausule = '';
    };
    /**
     * Prepare the where condition
     * @param {string} condition
     */
    SqlProvider.prototype.where = function (condition) {
        this.whereClausule = this.whereClausule + " " + condition;
        return this;
    };
    /**
     * Add or clause in Where Condition
     */
    SqlProvider.prototype.or = function () {
        this.whereClausule = this.whereClausule + " OR ";
        return this;
    };
    /**
     * Add and clause in Where Condition
     */
    SqlProvider.prototype.and = function () {
        this.whereClausule = this.whereClausule + " AND ";
        return this;
    };
    /**
     * Check if table name was declared before a query
     */
    SqlProvider.prototype.checkTableName = function () {
        if (this.tableName === '' || this.tableName === null || this.tableName === undefined) {
            throw new Error("You need to set the 'table' name before insert method");
        }
    };
    /**
     * Check if data contains the id property (PK of each table)
     * if user not provide a custom Where Clausule
     * @param {object} data properties of a table
     */
    SqlProvider.prototype.checkIdField = function (data) {
        if (data === void 0) { data = {}; }
        if (!data.hasOwnProperty('id') && this.whereClausule === '') {
            throw new Error("You need to pass the 'id' key in data object");
        }
    };
    /**
     * INSERT SQL command in fluent interface way.
     * @param {object} data properties that will be recorded in a table
     */
    SqlProvider.prototype.insert = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var cols, mask, vals, response, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.checkTableName();
                        cols = [];
                        mask = [];
                        vals = [];
                        Object.keys(data).forEach(function (key) {
                            cols.push(key);
                            mask.push('?');
                            vals.push(data[key]);
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.query("INSERT INTO " + this.tableName + " (" + cols.join() + ") VALUES (" + mask.join() + ")", vals)];
                    case 2:
                        response = _a.sent();
                        this.resetTableName();
                        return [2 /*return*/, response.res.insertId];
                    case 3:
                        err_1 = _a.sent();
                        throw new Error(err_1);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * UPDATE SQL command in fluent interface way.
     * Only provide the properties that will be updated.
     * @param {any} data properties that will be updated in a table
     */
    SqlProvider.prototype.update = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var update, vals, where, response, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.checkTableName();
                        this.checkIdField(data);
                        update = [];
                        vals = [];
                        Object.keys(data).forEach(function (key) {
                            if (key !== 'id') {
                                update.push(key + " = ?");
                                vals.push(data[key]);
                            }
                        });
                        where = (this.whereClausule !== '') ? this.whereClausule : "id = " + data.id;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.query("UPDATE " + this.tableName + " SET " + update.join() + " WHERE " + where, vals)];
                    case 2:
                        response = _a.sent();
                        this.resetWhereClausule();
                        return [2 /*return*/, response];
                    case 3:
                        err_2 = _a.sent();
                        console.error(err_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * SELECT * SQL command in fluent interface way.
     */
    SqlProvider.prototype.all = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, rows, results, index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.checkTableName();
                        return [4 /*yield*/, this.query("SELECT * FROM " + this.tableName)];
                    case 1:
                        response = _a.sent();
                        rows = response.res.rows;
                        results = [];
                        for (index = 0; index < rows.length; index++) {
                            results.push(rows.item(index));
                        }
                        return [2 /*return*/, results];
                }
            });
        });
    };
    /**
     * SELECT SQL command in fluent interface way.
     * The user can select all data, select by id
     * or select using multiple where clausule
     * @param {object} data can contains the id field for Where clause
     */
    SqlProvider.prototype.select = function (data) {
        if (data === void 0) { data = null; }
        return __awaiter(this, void 0, void 0, function () {
            var clausule, response, rows, results, index, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        clausule = '';
                        this.checkTableName();
                        if (this.whereClausule !== '') {
                            clausule = "WHERE " + this.whereClausule;
                        }
                        else if (data !== null && this.whereClausule === '') {
                            this.checkIdField(data);
                            clausule = "WHERE id = " + data.id;
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.query("SELECT * FROM " + this.tableName + " " + clausule)];
                    case 2:
                        response = _a.sent();
                        this.resetWhereClausule();
                        rows = response.res.rows;
                        results = [];
                        for (index = 0; index < rows.length; index++) {
                            results.push(rows.item(index));
                        }
                        return [2 /*return*/, results];
                    case 3:
                        err_3 = _a.sent();
                        console.error(err_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * DELETE SQL in a fluent interface way.
     * User can provide a specific where clause.
     * @param {object} data can contain the id key used in delete
     */
    SqlProvider.prototype.delete = function (data) {
        if (data === void 0) { data = null; }
        return __awaiter(this, void 0, void 0, function () {
            var clausule, response, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.checkTableName();
                        clausule = '';
                        if (this.whereClausule !== '') {
                            clausule = this.whereClausule;
                        }
                        else if (data !== null && this.whereClausule === '') {
                            this.checkIdField(data);
                            clausule = "id = " + data.id;
                        }
                        else {
                            throw new Error("You need to set a WHERE clausule or pass the ID key in object as parameter");
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.query("DELETE FROM " + this.tableName + " WHERE " + clausule)];
                    case 2:
                        response = _a.sent();
                        this.resetWhereClausule();
                        return [2 /*return*/, response];
                    case 3:
                        err_4 = _a.sent();
                        console.error(err_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Methods for old Ionic Storage Interface
    SqlProvider.prototype._getBackupLocation = function (dbFlag) {
        switch (dbFlag) {
            case SqlProvider_1.BACKUP_LOCAL:
                return 2;
            case SqlProvider_1.BACKUP_LIBRARY:
                return 1;
            case SqlProvider_1.BACKUP_DOCUMENTS:
                return 0;
            default:
                throw Error('Invalid backup flag: ' + dbFlag);
        }
    };
    // Initialize the DB with our required tables 
    SqlProvider.prototype._tryInit = function () {
        this.query('CREATE TABLE IF NOT EXISTS kv (key text primary key, value text)').catch(function (err) {
            console.error('Storage: Unable to create initial storage tables', err.tx, err.err);
        });
    };
    /**
     * Perform an arbitrary SQL operation on the database. Use this method
     * to have full control over the underlying database through SQL operations
     * like SELECT, INSERT, and UPDATE.
     *
     * @param {string} query the query to run
     * @param {array} params the additional params to use for query placeholders
     * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
     */
    SqlProvider.prototype.query = function (query, params) {
        var _this = this;
        if (params === void 0) { params = []; }
        return new Promise(function (resolve, reject) {
            try {
                _this._db.transaction(function (tx) {
                    tx.executeSql(query, params, function (tx, res) { return resolve({ tx: tx, res: res }); }, function (tx, err) { return reject({ tx: tx, err: err }); });
                }, function (err) { return reject({ err: err }); });
            }
            catch (err) {
                reject({ err: err });
            }
        });
    };
    /**
     * Get the value in the database identified by the given key.
     * @param {string} key the key
     * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
     */
    SqlProvider.prototype.get = function (key) {
        return this.query('select key, value from kv where key = ? limit 1', [key]).then(function (data) {
            if (data.res.rows.length > 0) {
                return data.res.rows.item(0).value;
            }
        });
    };
    /**
    * Set the value in the database for the given key. Existing values will be overwritten.
    * @param {string} key the key
    * @param {string} value The value (as a string)
    * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
    */
    SqlProvider.prototype.set = function (key, value) {
        return this.query('insert or replace into kv(key, value) values (?, ?)', [key, value]);
    };
    /**
    * Remove the value in the database for the given key.
    * @param {string} key the key
    * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
    */
    SqlProvider.prototype.remove = function (key) {
        return this.query('delete from kv where key = ?', [key]);
    };
    /**
    * Clear all keys/values of your database.
    * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
    */
    SqlProvider.prototype.clear = function () {
        return this.query('delete from kv');
    };
    SqlProvider.prototype.assign = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (typeof Object.assign !== 'function') {
            // use the old-school shallow extend method 
            return this._baseExtend(args[0], [].slice.call(args, 1), false);
        }
        // use the built in ES6 Object.assign method 
        return Object.assign.apply(null, args);
    };
    /**
     * Apply default arguments if they don't exist in
     * the first object.
     * @param the destination to apply defaults to.
     */
    SqlProvider.prototype.defaults = function (dest) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
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
    };
    SqlProvider.prototype._baseExtend = function (dst, objs, deep) {
        for (var i = 0, ii = objs.length; i < ii; ++i) {
            var obj = objs[i];
            if (!obj || !isObject(obj) && !isFunction(obj))
                continue;
            var keys = Object.keys(obj);
            for (var j = 0, jj = keys.length; j < jj; j++) {
                var key = keys[j];
                var src = obj[key];
                if (deep && isObject(src)) {
                    if (!isObject(dst[key]))
                        dst[key] = isArray(src) ? [] : {};
                    this._baseExtend(dst[key], [src], true);
                }
                else {
                    dst[key] = src;
                }
            }
        }
        return dst;
    };
    SqlProvider.BACKUP_LOCAL = 2;
    SqlProvider.BACKUP_LIBRARY = 1;
    SqlProvider.BACKUP_DOCUMENTS = 0;
    SqlProvider = SqlProvider_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Platform, SQLite])
    ], SqlProvider);
    return SqlProvider;
    var SqlProvider_1;
}());
export { SqlProvider };
//# sourceMappingURL=index.js.map