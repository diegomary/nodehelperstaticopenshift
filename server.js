//  OpenShift sample Node application
let express = require('express');
let app = express(); 
let redis = require('redis');   

let port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
let ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'

app.use(express.static(__dirname + '/images'));

app.get('/',  (req, res)=> {
  
      res.send('This is the starting point');      
 
});


app.get('/redisstringsample', (req, res) => { 

    let redisClient = redis.createClient({host : 'redis-19729.c10.us-east-1-2.ec2.cloud.redislabs.com', port : 19729});

    redisClient.auth('diegomary6298',(err,reply) => {
        console.log(err);
        console.log(reply);
    });

    redisClient.on('ready',() =>{
        console.log("Redis is ready");
        redisClient.set("Agrimony","Agrimony is the first flower in the list",(err,reply)=> {
            console.log(err);
            console.log(reply);

            redisClient.get("Agrimony",(err,reply) =>{
             console.log(err);
             console.log(reply);
             res.send(reply);
            });
        });     
    });

    redisClient.on('error',() => {
     console.log("Error in Redis");
    });       
});


app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
