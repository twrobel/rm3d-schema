var express = require('express')
  , mongoskin = require('mongoskin')
 
var app = express()
app.use(express.bodyParser())


// The number of milliseconds in one day
var oneDay = 86400000;

// Serve up content from public directory
app.use(express.static(__dirname + '/public', { maxAge: oneDay }));

 
var db = mongoskin.db('mongodb://rm3d:rm3d@ds027769.mongolab.com:27769/rm3d_schema', {safe:true});
 
RegExp.quote = function(str) {
    return (str+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
};

app.param('collectionName', function(req, res, next, collectionName){
  req.collection = db.collection(collectionName)
  return next()
})
app.get('/', function(req, res) {
  res.send('please select a collection, e.g., /collections/messages')
})
 
app.get('/collections/:collectionName', function(req, res) {
  req.collection.find({},{limit:10, sort: [['_id',-1]]}).toArray(function(e, results){
    if (e) return next(e)
    res.send(results)
  })
})
 
app.post('/collections/:collectionName', function(req, res) {
  req.collection.insert(req.body, {}, function(e, results){
    if (e) return next(e)
    res.send(results)
  })
})

app.get('/collections/:collectionName/type/:type', function(req, res) {
  req.collection.findOne({type: new RegExp('^' + RegExp.quote(req.params.type) + '$', "i")}, function(e, result){
    if (e) return next(e)
    res.send(result)
  })
})
 
app.get('/collections/:collectionName/:id', function(req, res) {
  req.collection.findOne({_id: req.collection.id(req.params.id)}, function(e, result){
    if (e) return next(e)
    res.send(result)
  })
})
app.put('/collections/:collectionName/:id', function(req, res) {
  req.collection.update({_id: req.collection.id(req.params.id)}, {$set:req.body}, {safe:true, multi:false}, function(e, result){
    if (e) return next(e)
    res.send((result===1)?{msg:'success'}:{msg:'error'})
  })
})
app.del('/collections/:collectionName/:id', function(req, res) {
  req.collection.remove({_id: req.collection.id(req.params.id)}, function(e, result){
    if (e) return next(e)
    res.send((result===1)?{msg:'success'}:{msg:'error'})
  })
})
 
 
app.listen(process.env.PORT || 3000);
