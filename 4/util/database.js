const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = 'mongodb+srv://razidev:testing123@cluster0.flgpv.mongodb.net/shop?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

let _db;

const mongoConnect = callback => {
    client.connect()
    .then(client => {
        console.log('connected')
        _db = client.db();
        callback()
    })
    .catch(err => {
        console.log(err);
        throw err;
    })
}

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;