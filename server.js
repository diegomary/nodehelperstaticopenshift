//  OpenShift sample Node application
let express = require('express');
let app = express();    

let port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
let ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'



app.get('/', function (req, res) {
  
      res.send('This is the starting point');
 
});


app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
