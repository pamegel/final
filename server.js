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
      else if (messageText === 'ขอบใจ'){
        sendTextMessage(senderID, "ยินดีช่วยเหมียวว <3");
      }

      // If we receive a text message, check to see if it matches a keyword
      // and send back the example. Otherwise, just echo the text we received.
      switch (messageText) {
        case 'hello':
          sendGreetMessage(senderID);
          break;
          case 'ขอบใจ':
          break;
        /*case 'quick reply':
          sendQuickReply(senderID);
          break;*/
        default:
          sendTextMessage(senderID, "พิมพ์อะไรแมวไม่รู้เรื่อง :p ทักทายแมวด้วยคำว่า \"hello\" สิ \nหรือถ้าอยากขอบคุณละก็ พิมพ์ \"ขอบใจ\" " );
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
         sendTextMessage(senderID, "ไม่ต้องการความช่วยเหลือเหยออ เหมียวว :("+"\n"+"หากคุณต้องการมองหาที่ๆน่าเที่ยวในปราจีนบุรีอีก ให้แมวช่วยสิ");
    }
    else if (payload == 'fineHere1') {
      sendTextMessage(senderID, "ชือ : 1"
      +"\n เวลาทำการ : "
      +"\n วันเปิดปิด : "
      +"\n คำอธิบาย : "
      +"\n แผนที่ : ");
      fineHeres(senderID);

    }
    else if (payload == 'fineHere2') {
      sendTextMessage(senderID, "ชือ : 2"
      +"\n เวลาทำการ : "
      +"\n วันเปิดปิด : "
      +"\n คำอธิบาย : "
      +"\n แผนที่ : ");
      fineHeres(senderID);

    }
    else if (payload == 'fineHere3') {
      sendTextMessage(senderID, "ชือ : 3"
      +"\n เวลาทำการ : "
      +"\n วันเปิดปิด : "
      +"\n คำอธิบาย : "
      +"\n แผนที่ : ");
      fineHeres(senderID);

    }
    else if (payload == 'fineHere4') {
      sendTextMessage(senderID, "ชือ : 4"
      +"\n เวลาทำการ : "
      +"\n วันเปิดปิด : "
      +"\n คำอธิบาย : "
      +"\n แผนที่ : ");
      fineHeres(senderID);

    }
    else if (payload == 'fineHere5') {
      sendTextMessage(senderID, "ชือ : 5"
      +"\n เวลาทำการ : "
      +"\n วันเปิดปิด : "
      +"\n คำอธิบาย : "
      +"\n แผนที่ : ");
      fineHeres(senderID);

    }
    else if (payload == 'fineHere6') {
      sendTextMessage(senderID, "ชือ : 6"
      +"\n เวลาทำการ : "
      +"\n วันเปิดปิด : "
      +"\n คำอธิบาย : "
      +"\n แผนที่ : ");
      fineHeres(senderID);

    }
    else if (payload == 'fineHere7') {
      sendTextMessage(senderID, "ชือ : 7"
      +"\n เวลาทำการ : "
      +"\n วันเปิดปิด : "
      +"\n คำอธิบาย : "
      +"\n แผนที่ : ");
      fineHeres(senderID);

    }
    else if (payload == 'fineHere8') {
      sendTextMessage(senderID, "ชือ : 8"
      +"\n เวลาทำการ : "
      +"\n วันเปิดปิด : "
      +"\n คำอธิบาย : "
      +"\n แผนที่ : ");
      fineHeres(senderID);

    }
    else if (payload == 'fineHere9') {
      sendTextMessage(senderID, "ชือ : 9"
      +"\n เวลาทำการ : "
      +"\n วันเปิดปิด : "
      +"\n คำอธิบาย : "
      +"\n แผนที่ : ");
      fineHeres(senderID);

    }
    else if (payload == 'fineHere10') {
      sendTextMessage(senderID, "ชือ : 10"
      +"\n เวลาทำการ : "
      +"\n วันเปิดปิด : "
      +"\n คำอธิบาย : "
      +"\n แผนที่ : ");
      fineHeres(senderID);

    }else {
      var result = "";
    }

    // When a postback is called, we'll send a message back to the sender to
    // let them know it was successful
    // sendTextMessage(senderID, emoji);
  }
  // --------------------ทักทายตอบกลับ---------------------------
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
  //-----------------------------------------------------------------------------
  //------------------หาสถานที่---------------------------------------------------
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
              title:"1",
              item_url:"",
              image_url:"http://img.painaidii.com/images/20140926_3_1411711631_69610.jpg",
              subtitle:" ",
              buttons:[
                {
                  type:"postback",
                  title:"เลือกที่นี้",
                  payload:"fineHere1"
                }]
             },
             {
               title:"2",
               item_url:"",
               image_url:"http://img.painaidii.com/images/20140926_3_1411711631_69610.jpg",
               subtitle:" ",
               buttons:[
                 {
                   type:"postback",
                   title:"เลือกที่นี้",
                   payload:"fineHere2"
                 }]
              },
              {
                title:"3",
                item_url:"",
                image_url:"http://img.painaidii.com/images/20140926_3_1411711631_69610.jpg",
                subtitle:" ",
                buttons:[
                  {
                    type:"postback",
                    title:"เลือกที่นี้",
                    payload:"fineHere3"
                  }]
               },
               {
                 title:"4",
                 item_url:"",
                 image_url:"http://img.painaidii.com/images/20140926_3_1411711631_69610.jpg",
                 subtitle:" ",
                 buttons:[
                   {
                     type:"postback",
                     title:"เลือกที่นี้",
                     payload:"fineHere4"
                   }]
                },
                {
                  title:"5",
                  item_url:"",
                  image_url:"http://img.painaidii.com/images/20140926_3_1411711631_69610.jpg",
                  subtitle:" ",
                  buttons:[
                    {
                      type:"postback",
                      title:"เลือกที่นี้",
                      payload:"fineHere5"
                    }]
                 },
                 {
                   title:"6",
                   item_url:"",
                   image_url:"http://img.painaidii.com/images/20140926_3_1411711631_69610.jpg",
                   subtitle:" ",
                   buttons:[
                     {
                       type:"postback",
                       title:"เลือกที่นี้",
                       payload:"fineHere6"
                     }]
                  },
                  {
                    title:"7",
                    item_url:"",
                    image_url:"http://img.painaidii.com/images/20140926_3_1411711631_69610.jpg",
                    subtitle:" ",
                    buttons:[
                      {
                        type:"postback",
                        title:"เลือกที่นี้",
                        payload:"fineHere7"
                      }]
                   },
                   {
                     title:"8",
                     item_url:"",
                     image_url:"http://img.painaidii.com/images/20140926_3_1411711631_69610.jpg",
                     subtitle:" ",
                     buttons:[
                       {
                         type:"postback",
                         title:"เลือกที่นี้",
                         payload:"fineHere8"
                       }]
                    },
                    {
                      title:"9",
                      item_url:"",
                      image_url:"http://img.painaidii.com/images/20140926_3_1411711631_69610.jpg",
                      subtitle:" ",
                      buttons:[
                        {
                          type:"postback",
                          title:"เลือกที่นี้",
                          payload:"fineHere9"
                        }]
                     },
                     {
                       title:"10",
                       item_url:"",
                       image_url:"http://img.painaidii.com/images/20140926_3_1411711631_69610.jpg",
                       subtitle:" ",
                       buttons:[
                         {
                           type:"postback",
                           title:"เลือกที่นี้",
                           payload:"fineHere10"
                         },
                         ]
                      }]
        }
      }
    }
  };
  callSendAPI(messageData);
  }
  //-----------------------------------------------------------------------------
  //----------------ตอบกลับ------------------------------------------------------
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
  //------------------------------------------------------------------------------
  //--------ดึงAPIคนที่คุยด้วย---------------------------------------------------------
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
  //------------------------------------------------------------------------------
  //------------ก่อนจาก-----------------------------------------------------------
  function fineHeres(recipientId, messageText) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text : "หวังว่าจะช่วยได้นะ เหมียวว :3",
              buttons: [{
                type: "postback",
                title: "อยากหาที่อื่นอีก",
                payload: "findLocation"
              }],
          }
        }
      }
    };

    callSendAPI(messageData);
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
