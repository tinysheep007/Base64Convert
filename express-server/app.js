var createError = require('http-errors');
var express = require('express');
var path = require('path');
var ba64 = require('ba64')
var cors = require('cors')

var app = express();

app.use(cors());

// view engine setup
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));



app.post('/upload', async (req, res, next) => {
  // exclude name and message for the sake of demo
  // all other body items will be considered as a file
  const { name, message, ...files } = req.body;
  let photoID = 0;

  for(let key in files){
    const base64 = files[key]

    // check if it's correctly formatted Base64 Data URI
    if(checkBase64(base64)){
      // Write it to our root directory using input key as filename
      // eg. picture[1]
      if(key==null){
        console.log("null");
        console.log(photoID);
        ba64.writeImageSync(photoID, base64)
      }else{
        console.log(key);
        ba64.writeImageSync(key, base64)
      }
      
    }
    photoID = photoID + 1;
  }

  res.send({files})
})

function checkBase64(string){
  const B64_REGEX = /^data:.*;base64,([0-9a-zA-Z+\/]{4})*(([0-9a-zA-Z+\/]{2}==)|([0-9a-zA-Z+\/]{3}=))?$/i 

  return B64_REGEX.test(string)
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;