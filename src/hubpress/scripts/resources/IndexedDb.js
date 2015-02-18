const dexie = require("dexie");

function _initDb(dbName) {
  const _db = new Dexie(dbName);

  _db.version(1).stores({
    posts: "&id,&name,original.name,published,[published+original.name]"
  });

  _db.open().catch(function (err) {
    console.log(false, "DB ERROR: " + err);
  });;
  return _db;
}

class IndexedDb {
  constructor() {
    this.db = null;
  }

  setDbName(dbName) {
    console.info('IndexedDb - generate');
    console.log('IndexedDb - generate', dbName);
    if(this.db){
      console.log('IndexedDb - delete db');
      db.close();
    }
    this.db = _initDb(dbName);
  }

  getDb() {
    return this.db;
  }
}



export default new IndexedDb();
