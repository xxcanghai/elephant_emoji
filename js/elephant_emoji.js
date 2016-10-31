//基础类库
var xxcanghai;
(function (xxcanghai) {
    /**
     * 封装的数据操作对象类
     *
     * @interface indexedDBObject
     */
    var indexedDBObject = (function () {
        function indexedDBObject(name, version) {
            this.name = name;
            this.version = version;
            this.db = null;
        }
        indexedDBObject.prototype.openDB = function (onSuccess) {
            onSuccess = typeof onSuccess === "function" ? onSuccess : function () { };
            var dbObj = this;
            var request = window.indexedDB.open(this.name, this.version);
            request.addEventListener("success", function (e) {
                var that = this;
                // console.log("openDB", e.type, e);
                var db = e.target.result;
                dbObj.db = db;
                //----------
                onSuccess.call(that, db);
            });
            request.addEventListener("upgradeneeded", function (e) {
                var that = this;
                console.log("openDB", e.type, e);
                var db = e.target.result;
            });
            return request;
        };
        /**
         * 关闭数据库
         *
         * @export
         * @returns {void}
         */
        indexedDBObject.prototype.closeDB = function () {
            return this.db.close();
        };
        /**
         * 删除数据库
         *
         * @export
         * @returns {IDBOpenDBRequest}
         */
        indexedDBObject.prototype.deleteDB = function () {
            return window.indexedDB.deleteDatabase(this.name);
        };
        /**
         * 添加储存空间（表）
         *
         * @param {string} storeName 存储空间名称（表名）
         * @param {IDBObjectStoreParameters} config 存储空间配置对象
         */
        indexedDBObject.prototype.addObjectStore = function (storeName, config, onSuccess) {
            if (config === void 0) { config = {}; }
            onSuccess = typeof onSuccess === "function" ? onSuccess : function () { };
            this.version += 1;
            var dbObj = this;
            var request = window.indexedDB.open(this.name, this.version);
            request.addEventListener("upgradeneeded", function (e) {
                var cfg = $.extend(true, { autoIncrement: false, keyPath: "_id" }, config);
                if (!dbObj.db.objectStoreNames.contains(storeName)) {
                    dbObj.db.createObjectStore(storeName, cfg);
                }
                onSuccess.call(this, e);
            });
        };
        indexedDBObject.prototype.addData = function (storeName, data, onSuccess) {
            onSuccess = typeof onSuccess === "function" ? onSuccess : function () { };
            var transaction = this.db.transaction(storeName, "readwrite");
            var store = transaction.objectStore(storeName);
            var request = store.add(data);
            request.addEventListener("success", function (e) {
                return onSuccess.call(this, e);
            });
        };
        /**
         * 为操作进行数据操作时的request请求增加log日志
         *
         * @param {IDBOpenDBRequest} request
         * @param {string} openMessage
         *
         * @memberOf indexedDBObject
         */
        indexedDBObject.prototype.setEventLog = function (request, openMessage) {
            if (openMessage === void 0) { openMessage = ""; }
            request.addEventListener("error", function (e) {
                var that = this;
                console.log(openMessage || "openDB", e.type, e);
            });
            request.addEventListener("success", function (e) {
                var that = this;
                // console.log(openMessage || "openDB", e.type, e);
            });
            // request.addEventListener("upgradeneeded", function (e: IDBVersionChangeEvent) {
            //     var that: IDBOpenDBRequest = this;
            //     console.log(openMessage || "openDB", e.type, e);
            // });
            request.addEventListener("blocked", function (e) {
                var that = this;
                console.log(openMessage || "openDB", e.type, e);
            });
        };
        return indexedDBObject;
    }());
    xxcanghai.indexedDBObject = indexedDBObject;
})(xxcanghai || (xxcanghai = {}));
//业务逻辑
var xxcanghai;
(function (xxcanghai) {
    // window.indexedDB.deleteDatabase("emojiDB");
    var emojiDB = new xxcanghai.indexedDBObject("emojiDB", 1);
    var request = emojiDB.openDB(function (result) {
        // console.log(result, emojiDB.db);
        emojiDB.addObjectStore("person", {}, function () {
            emojiDB.addData("person", { name: "jicanghai", age: 200 });
            emojiDB.addData("person", { name: "sunyingying", age: 300 });
        });
    });
})(xxcanghai || (xxcanghai = {}));
