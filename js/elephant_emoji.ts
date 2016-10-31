
//基础类库
namespace xxcanghai {
    /**
     * 封装的数据操作对象类
     *
     * @interface indexedDBObject
     */
    export class indexedDBObject {
        /**
         * 数据库名称
         * 
         * @type {string}
         * @memberOf indexedDBObject
         */
        public name: string;

        /**
         * 数据库版本号
         * 
         * @type {number}
         * @memberOf indexedDBObject
         */
        public version: number;

        /**
         * 实际数据库数据（result）
         * 
         * @type {IDBDatabase}
         * @memberOf indexedDBObject
         */
        public db: IDBDatabase;

        public constructor(name: string, version: number) {
            this.name = name;
            this.version = version;
            this.db = null;
        }


        /**
         * 打开数据库
         * 
         * @export
         * @template T 泛型T为打开成功后的返回result值的类型
         * @param {(result?: T) => void} onSuccess 当打开成功后调用，返回参数result值
         * @returns {IDBOpenDBRequest}
         */
        public openDB<T>(onSuccess?: (result?: T & IDBDatabase) => void): IDBOpenDBRequest;
        public openDB(onSuccess?: (result?: IDBDatabase) => void): IDBOpenDBRequest {
            onSuccess = typeof onSuccess === "function" ? onSuccess : function () { };
            var dbObj: indexedDBObject = this;
            var request: IDBOpenDBRequest = window.indexedDB.open(this.name, this.version);

            request.addEventListener("success", function (e: Event) {
                var that: IDBOpenDBRequest = this;
                // console.log("openDB", e.type, e);
                var db: IDBDatabase = (<IDBOpenDBRequest>e.target).result;
                dbObj.db = db;
                //----------
                onSuccess.call(that, db)
            });

            request.addEventListener("upgradeneeded", function (e: IDBVersionChangeEvent) {
                var that: IDBOpenDBRequest = this;
                console.log("openDB", e.type, e);

                var db: IDBDatabase = (<IDBOpenDBRequest>e.target).result;

            });

            return request;
        }

        /**
         * 关闭数据库
         * 
         * @export
         * @returns {void}
         */
        public closeDB(): void {
            return this.db.close();
        }

        /**
         * 删除数据库
         * 
         * @export
         * @returns {IDBOpenDBRequest}
         */
        public deleteDB(): IDBOpenDBRequest {
            return window.indexedDB.deleteDatabase(this.name);
        }

        /**
         * 添加储存空间（表）
         * 
         * @param {string} storeName 存储空间名称（表名）
         * @param {IDBObjectStoreParameters} config 存储空间配置对象
         */
        public addObjectStore(storeName: string, config: IDBObjectStoreParameters = {}, onSuccess?: () => void) {
            onSuccess = typeof onSuccess === "function" ? onSuccess : function () { };
            this.version += 1;
            var dbObj = this;
            var request = window.indexedDB.open(this.name, this.version);
            request.addEventListener("upgradeneeded", function (e: IDBVersionChangeEvent) {
                var cfg: IDBObjectStoreParameters = $.extend(true, { autoIncrement: false, keyPath: "_id" }, config);
                if (!dbObj.db.objectStoreNames.contains(storeName)) {
                    dbObj.db.createObjectStore(storeName, cfg);
                }
                onSuccess.call(this, e);
            });
        }

        public addData(storeName: string, data: any, onSuccess?: () => void) {
            onSuccess = typeof onSuccess === "function" ? onSuccess : function () { };
            var transaction: IDBTransaction = this.db.transaction(storeName, "readwrite");
            var store: IDBObjectStore = transaction.objectStore(storeName);
            var request = store.add(data);
            request.addEventListener("success", function (e) {
                return onSuccess.call(this, e);
            });
        }

        /**
         * 为操作进行数据操作时的request请求增加log日志
         * 
         * @param {IDBOpenDBRequest} request
         * @param {string} openMessage
         * 
         * @memberOf indexedDBObject
         */
        public setEventLog(request: IDBRequest, openMessage: string = "") {
            request.addEventListener("error", function (e: ErrorEvent) {
                var that: IDBOpenDBRequest = this;
                console.log(openMessage || "openDB", e.type, e);
            });

            request.addEventListener("success", function (e: Event) {
                var that: IDBOpenDBRequest = this;
                // console.log(openMessage || "openDB", e.type, e);
            });

            // request.addEventListener("upgradeneeded", function (e: IDBVersionChangeEvent) {
            //     var that: IDBOpenDBRequest = this;
            //     console.log(openMessage || "openDB", e.type, e);
            // });

            request.addEventListener("blocked", function (e: Event) {
                var that: IDBOpenDBRequest = this;
                console.log(openMessage || "openDB", e.type, e);
            });
        }
    }


}


//业务逻辑
namespace xxcanghai {
    // window.indexedDB.deleteDatabase("emojiDB");
    var emojiDB = new indexedDBObject("emojiDB", 1);
    var request: IDBOpenDBRequest = emojiDB.openDB(function (result) {
        // console.log(result, emojiDB.db);
        emojiDB.addObjectStore("person", {}, function () {
            emojiDB.addData("person", { name: "jicanghai", age: 200 });
            emojiDB.addData("person", { name: "sunyingying", age: 300 });
        });
    });

}
