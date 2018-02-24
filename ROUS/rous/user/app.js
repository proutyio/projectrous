
var express = require('express');
var app = express();
var port = process.env.PORT || 8002;



app.get('/test', (req, res) => {
  res.send({ test: 'test' });
});



app.listen(port, () => console.log(`Listening on port ${port}`));