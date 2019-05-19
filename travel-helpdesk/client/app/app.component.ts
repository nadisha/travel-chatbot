import Speech from 'speak-tts';

import { Component, ViewChild, ElementRef, OnInit, AfterContentInit } from '@angular/core';
import { Message } from './models/message';
import { from } from 'rxjs';
import { ChatbotServiceService } from './services/chatbot-service.service';
import { Avatar } from './models/avatar';
import { $ } from 'jquery';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  
  title = 'GO GO Travel - Helpdesk';
  text = '';
  speech: Speech;

  firstMessage = new Message('Hello! Welcome to GO-GO travels.', false, new Date());

  public messages: Message[] = [];

  constructor(private service: ChatbotServiceService) {
    this.speech = new Speech() // will throw an exception if not browser supported        
    this.speech.init({
      'volume': 1,
      'lang': 'en-GB',
      'rate': 1,
      'pitch': 1,
      'voice':'Google UK English Male',
      'splitSentences': true
    }).then((data) => {      
      console.log("Speech is ready, voices are available", data)
    }).catch(e => {
      console.error("An error occured while initializing : ", e)
    });     
  }

  ngOnInit() {    
    this.messages.push(this.firstMessage);        
  }  

  public sendMessage() {
    if (this.text.trim().length == 0) {
      console.log('Message is empty')
      return;
    }
    var newUserMsg = new Message(this.text, true, new Date());
    this.messages.push(newUserMsg);
    // Empty message
    this.text = '';
    this.service.send(newUserMsg).subscribe( newRobotMsg => {
      newRobotMsg.avatarImg = Avatar.ROBOT;
      newRobotMsg.isHuman = false;
      newRobotMsg.timestamp = new Date();
      this.messages.push(newRobotMsg);
      this.textToVoice(newRobotMsg);
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    }, err => {
      console.error("Some error has occured", err);
    })  
  }

  private textToVoice(message: Message) {
    var readContent = this.removeHtmlElements(message.content);
    console.log('Read : ' + readContent);
    this.speech.speak({
      text: readContent,
      queue: false,
      listeners: {
        onstart: () => {
          console.log("Start utterance");
        },
        onend: () => {
          console.log("End utterance");
        },
        onresume: () => {
          console.log("Resume utterance");
        },
        onboundary: event => {
          console.log(
            event.name +
              " boundary reached after " +
              event.elapsedTime +
              " milliseconds."
          );
        }
      }
    }).then(() => {
      console.log("Success !")
    }).catch(e => {
      console.error("An error occurred :", e)
    })
  }

  private removeHtmlElements(msg: string) {
    return this.removeBrTags(msg);
  }

  private removeBrTags(msg: string) {
    msg = msg.replace(/<br\/>/g, ' ');
    return msg;
  }
}
