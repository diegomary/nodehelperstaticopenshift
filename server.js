//  OpenShift sample Node application
let express = require('express');
let auth = require('basic-auth');
let redis = require('redis');   
let bodyParser = require('body-parser');
let port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
let ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';


let allowCrossDomain =  (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    // intercept OPTIONS method
    if ('OPTIONS' === req.method) {
        res.send(200);
    }
    else {
        next();
    }};
let app = express(); 
app.use(allowCrossDomain);
app.use(express.static(__dirname + '/images'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/',  (req, res)=> { res.send('This is the starting point'); });


app.post('/postredis', (req, res) => {
let credentials = auth(req);
    if (!credentials || credentials.name !== 'diego' || credentials.pass !== 'secret') {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm = "example"');
        res.end('Access denied');
    } else {
      let body = req.body;
      let key = body.Key;
      let value = body.Value;
      let redisClient = redis.createClient({host : 'redis-19729.c10.us-east-1-2.ec2.cloud.redislabs.com', port : 19729});
      redisClient.auth('taddeo62',(err,reply) => {
          console.log(err);
          console.log(reply);
      });
      redisClient.on('ready',() =>{
          console.log("Redis is ready");
          redisClient.set(key,value,(err,reply)=> {
              console.log(err);
              console.log(reply);

              redisClient.get(key,(err,reply) =>{
               console.log(err);
               console.log(reply);
               res.send(reply);
              });
          });     
      });
      redisClient.on('error',() => {
      console.log("Error in Redis");
      });
    }	
});


app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
