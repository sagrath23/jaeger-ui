import Dexie from 'dexie';

// store it in indexedDB
const db = new Dexie("TracesDatabase");
db.version(1).stores({
  traces: "traceid,tracedata",
});

export default db;