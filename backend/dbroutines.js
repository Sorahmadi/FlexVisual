const MongoClient = require("mongodb").MongoClient;
const { atlas, appdb } = require("./config");

let db;

const getDBInstance = async () => {
  if (db) {
    console.log("Connected to DB");
    return db;
  }
  try {
    const conn = await MongoClient.connect(atlas, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = conn.db(appdb);
    console.log("Connected to DB");
  } catch (err) {
    console.log(err);
  }
  return db;
};

const findAll = (db, coll, criteria, projection) =>
  db.collection(coll).find(criteria).project(projection).toArray();

const findOne = (db, coll, criteria) => db.collection(coll).findOne(criteria);

const addOne = (db, coll, doc) => db.collection(coll).insertOne(doc);

const updateOne = (db, coll, criteria, projection) =>
  db
    .collection(coll)
    .findOneAndUpdate(criteria, { $set: projection }, { rawResult: true });

const deleteOne = (db, coll, criteria) =>
  db.collection(coll).deleteOne(criteria);

const deleteMany = (db, coll, criteria) =>
  db.collection(coll).deleteMany(criteria);

module.exports = {
  getDBInstance,
  deleteOne,
  deleteMany,
  updateOne,
  findOne,
  addOne,
  findAll,
};
