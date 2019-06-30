'use strict';

require('dotenv').config()
const APIAI_TOKEN = process.env.APIAI_TOKEN;
const APIAI_SESSION_ID = process.env.APIAI_SESSION_ID;

const express = require('express');
const app = express();



app.use(express.static(__dirname + '/views')); // html
app.use(express.static(__dirname + '/public')); // js, css, images

const server = app.listen(process.env.PORT || 8080, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

// const server = app.listen(3000, function(){
// console.log('listening on  port %d', server.address().port);
// });


const io = require('socket.io')(server);
io.on('connection', function(socket){
  console.log('a user connected');
});

const apiai = require('apiai')(APIAI_TOKEN);

// Web UI
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

io.on('connection', function(socket) {
  socket.on('chat message', (text) => {
    console.log('Message: ' + text);

    // Get a reply from API.ai

    let apiaiReq = apiai.textRequest(text, {
      sessionId: '<unique session id>'
    });

    // apiaiReq.on('response', (response) => {
    //   let aiText = response.result.fulfillment.speech;
    //   console.log('Bot reply: ' + aiText);
    //   socket.emit('bot reply', aiText);
    // });
    var reply="",replySpeech="";
    apiaiReq.on('response', (response) => {
    let aiMessages = response.result.fulfillment.messages;
    aiMessages.forEach(function (aiMessage){
    reply=reply+aiMessage.speech+ "<br>";
    replySpeech=replySpeech+aiMessage.speech+".!. ";
      // console.log('Bot Reply: '+ aiMessage.speech);
      // socket.emit('bot reply', aiMessage.speech);
      });
    
      console.log('Bot Reply: '+ reply);
      socket.emit('bot reply', reply);
      socket.emit('reply Speech', replySpeech);

      });
    
    apiaiReq.on('error', (error) => {
      console.log(error);
    });

    apiaiReq.end();

  });
});
