var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
})

var port = process.env.PORT || 3000;

app.set('view engine', 'ejs');


app.listen(port, function () {

  console.log('Example app listening on port 3000!');
  
});