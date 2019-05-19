'use strict'
const fs = require('fs');
const {NlpManager, ConversationContext} = require('node-nlp');
 
const manager = new NlpManager({ languages: ['en'], threshold: 0.8  });

var loaded = false;

if (fs.existsSync('./model.nlp')) {
  manager.load('./model.nlp');
  console.log('Model has been loaded.');
  loaded = true;
}

const context = new ConversationContext();

const ChatbotService = require('./chatbot.service');

exports.getAnswer = async function(req, res, next) {    
  console.log("Loaded : " + loaded);
  var query = req.body.q;
  if (!loaded) {
    res.send("First you need to load the model.");
    return
  } 
  var defaultMessage = "Sorry, I am not quite sure that I understood you correctly. Say again please."

  const response = await manager.process('en', query, context);
  console.log(response)

  if (response.answer) {
    defaultMessage = response.answer;
  }


  if (response.intent === 'travel.list.destinations') {
    console.log('Call Ontology to get the list')
    console.log(context.city)
    ChatbotService.getDestinationsByCity(context.city, function( destList ){           
      var destinations = [];
      for (var i = 0; i < destList.length; i++) {
        destinations.push(destList[i].name)
      }
      defaultMessage = defaultMessage.replace("[]", destinations.join('<br/>'))       
      res.send({ 'content' : defaultMessage});   
    }) 
  } else if (response.intent === 'travel.destination') {
    ChatbotService.getDestinationByName(context.destinantion, function (details) {
      var destinationDetails = [];
      destinationDetails.push("The locations is " + details.address);            
      destinationDetails.push("It is located in " + details.area.name + " area.");
      if (details.budget.free) {
        destinationDetails.push("Entrance is free.");
      } 

      if (details.budget.currency) {
        destinationDetails.push("Entrance fee for an adult is " + details.budget.adultCharge + " " + details.budget.currency);
        destinationDetails.push("Entrance fee for a child is " + details.budget.adultCharge + " " + details.budget.currency);
      }
        
      if (details.season.startMonth) {
        if (details.season.startMonth === 'January' && details.season.endMonth === 'December') {
          destinationDetails.push("Any time of the year is best to visit");  
        } else {
          destinationDetails.push("Best time to visit is from " + details.season.startMonth + " to " + details.season.endMonth);
        }
      }
      
      defaultMessage = defaultMessage.replace("[]", destinationDetails.join('<br/>'))     
      res.send({ 'content' : defaultMessage});  
    })
  } else {
    res.send({ 'content' : defaultMessage});  
  }
    
}


