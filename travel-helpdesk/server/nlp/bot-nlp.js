const { NlpManager } = require('node-nlp');
 
const manager = new NlpManager({ languages: ['en'] });

manager.addNamedEntityText('city', 'Colombo', ['en'], ['Colombo']);
manager.addNamedEntityText('city', 'Kandy', ['en'], ['Kandy']);

manager.addNamedEntityText('destinantion', 'Jami Ul-Alfar Mosque', ['en'], ['Jami Ul-Alfar Mosque']);
manager.addNamedEntityText('destinantion', 'Colombo Dutch Museum', ['en'], ['Colombo Dutch Museum']);
manager.addNamedEntityText('destinantion', 'Kelaniya Raja Maha Vihara', ['en'], ['Kelaniya Raja Maha Vihara']);
manager.addNamedEntityText('destinantion', 'National Museum Of Colombo', ['en'], ['National Museum Of Colombo']);
manager.addNamedEntityText('destinantion', 'Traditional Puppet Art Museum', ['en'], ['Traditional Puppet Art Museum']);
manager.addNamedEntityText('destinantion', 'Seema Malaka', ['en'], ['Seema Malaka']);

// Adds the utterances and intents for the NLP
manager.addDocument('en', 'thanks', 'greetings.bye');
manager.addDocument('en', 'thank you', 'greetings.bye');
manager.addDocument('en', 'thank you for your help', 'greetings.bye');
manager.addDocument('en', 'thanks for the information', 'greetings.bye');
manager.addDocument('en', 'thanks bye', 'greetings.bye');
manager.addDocument('en', 'thank you bye', 'greetings.bye');
manager.addDocument('en', 'bye', 'greetings.bye');

manager.addDocument('en', 'hello', 'greetings.hello');
manager.addDocument('en', 'hi', 'greetings.hello');
manager.addDocument('en', 'howdy', 'greetings.hello');
 
manager.addDocument('en', 'want to travel', 'travel.want');
// manager.addDocument('en', 'i want to go', 'travel.want');
// manager.addDocument('en', 'i like to travel', 'travel.want');

manager.addDocument('en', 'I would like to travel %city%', 'travel.city');
manager.addDocument('en', 'I like to go to %city%', 'travel.city');
manager.addDocument('en', 'I want to travel %city%', 'travel.city');

manager.addDocument('en', 'yes', 'travel.list.destinations');

manager.addDocument('en', '%destinantion%', 'travel.destination');

// Train also the NLG
manager.addAnswer('en', 'greetings.bye', 'It is my pleasure to serve you');
manager.addAnswer('en', 'greetings.bye', 'See you soon!');

manager.addAnswer('en', 'greetings.hello', 'How can I help you?');

manager.addAnswer('en', 'travel.want', 'Where do you want to travel?');

manager.addAnswer('en', 'travel.city', '{{city}} is a good choice. Do you like to know the travel destinations in {{city}} ?'); 

manager.addAnswer('en', 'travel.list.destinations', 'The destinantions are, <br/> []. <br/>If you like to know details of each destination, just type destination name');

manager.addAnswer('en', 'travel.destination', '[]');

// Train and save the model.
(async() => {
    await manager.train();
    manager.save('./model.nlp');
    console.log("Finish Training");
})();
