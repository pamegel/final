var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

app.use(bodyParser.json())
app.set('port', (process.env.PORT || 4000))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/webhook', function(req, res) {
  var key = 'EAAYB5mZATsskBACBdjfMpAB94jrghicZBhuJafK2go6d4uZCKBPqmAYDMJUuQZCtWRqy37uF1QGbBbos2aWtiLyyEs7aBtLjumrYFQQe2egZCWKNsFej4zVMeIRlWHvaV0kfmgiEEGT14VHIcqFeYN7eZBcJZAsqbJhCbOqx8024AZDZD'
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === key) {
    console.log("Validating webhook");
    res.send(req.query['hub.challenge'])
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

app.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object == 'page') {
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach(function(pageEntry) {
      var pageID = pageEntry.id;
      var timeOfEvent = pageEntry.time;

      // Iterate over each messaging event
      pageEntry.messaging.forEach(function(messagingEvent) {
        if (messagingEvent.message) {
          receivedMessage(messagingEvent);
        } else if (messagingEvent.postback) {
          receivedPostback(messagingEvent);
        } else {
          console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know you've
    // successfully received the callback. Otherwise, the request will time out.
    res.sendStatus(200);
  }
});

function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var isEcho = message.is_echo;
  var messageId = message.mid;
  var appId = message.app_id;
  var metadata = message.metadata;

  // You may get a text or attachment but not both
  var messageText = message.text;
  var messageAttachments = message.attachments;
  var quickReply = message.quick_reply;

 /* if (isEcho) {
    // Just logging message echoes to console
    console.log("Received echo for message %s and app %d with metadata %s",
      messageId, appId, metadata);
    return;
  } else if (quickReply) {
    var quickReplyPayload = quickReply.payload;
    console.log("Quick reply for message %s with payload %s",
      messageId, quickReplyPayload);
    sendTextMessage(senderID, "Quick reply tapped");
    return;
  }*/

  if (messageText) {
    if (messageText === 'hello') {
      sendTextMessage(senderID, "สวัสดีเหมียววว");
    }

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    switch (messageText) {
      case 'hello':
        sendGreetMessage(senderID);
        break;
      /*case 'quick reply':
        sendQuickReply(senderID);
        break;*/
      default:
        sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback
  // button for Structured Messages.
  var payload = event.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' " +
    "at %d", senderID, recipientID, payload, timeOfPostback);
  if(payload == 'findLocation'){
    findLocations(senderID);
  }
  else if(payload == 'noThank'){
       sendTextMessage(senderID, "ไม่ต้องการความช่วยเหลือเหยออ เหมียวว :("+"\n"+"หากคุณต้องการมองหาที่ๆน่าเที่ยวในปราจีนบุรีอีก ให้แมวช่วยสิ")
  } else {
    var result = "";
  }

  // When a postback is called, we'll send a message back to the sender to
  // let them know it was successful
  // sendTextMessage(senderID, emoji);
}

function sendGreetMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text : "นี้คือคู่มือสถานที่ท่องเที่ยวของคุณในปราจีนบุรี แมวมีตัวเลือกให้ข้างล่าง",
            buttons: [{
              type: "postback",
              title: "หาที่เที่ยว",
              payload: "findLocation"
            }, {
              type: "postback",
              title: "ไม่เป็นไร ขอบคุณ",
              payload: "noThank"
            }],
        }
      }
    }
  };

  callSendAPI(messageData);
}

function findLocations(recipientId, messageText) {
  var messageData = {
  recipient: {
    id : recipientId
  },
  message:{
    attachment:{
      type:"template",
      payload:{
        template_type:"generic",
        elements:[
          {
            title:"ที่ท่องเที่ยว",
            item_url:"",
            image_url:"http://img.painaidii.com/images/20140926_3_1411711631_69610.jpg",
            subtitle:" ",
            buttons:[
              {
                type:"postback",
                title:"เลือกที่นี้",
                payload:"fineHere"
              },
              {
                type:"postback",
                title:"ทุกที่ในปราจีนบุรี",
                payload:"everyWhere"
              }]
           },
           {
             title:"ที่ท่องเที่ยว",
             item_url:"",
             image_url:"http://img.painaidii.com/images/20140926_3_1411711631_69610.jpg",
             subtitle:" ",
             buttons:[
               {
                 type:"postback",
                 title:"เลือกที่นี้",
                 payload:"fineHere"
               },
               {
                 type:"postback",
                 title:"ทุกที่ในปราจีนบุรี",
                 payload:"everyWhere"
               }]
            }]
      }
    }
  }
};
callSendAPI(messageData);
}

function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: 'EAAYB5mZATsskBACBdjfMpAB94jrghicZBhuJafK2go6d4uZCKBPqmAYDMJUuQZCtWRqy37uF1QGbBbos2aWtiLyyEs7aBtLjumrYFQQe2egZCWKNsFej4zVMeIRlWHvaV0kfmgiEEGT14VHIcqFeYN7eZBcJZAsqbJhCbOqx8024AZDZD' },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });
}

/*function sendQuickReply(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: "What's your favorite movie genre?",
      quick_replies: [
        {
          "content_type":"text",
          "title":"Action",
          "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_ACTION"
        },
        {
          "content_type":"text",
          "title":"Comedy",
          "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_COMEDY"
        },
        {
          "content_type":"text",
          "title":"Drama",
          "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA"
        }
      ]
    }
  };
  callSendAPI(messageData);
}*/

app.listen(app.get('port'), function () {
  console.log('run at port', app.get('port'))
})
