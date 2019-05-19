import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Message } from '../models/message';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ChatbotServiceService {

  constructor(private http: HttpClient) {}

  public send(msg: Message) {
    return this.http.post<Message>('/api/ask', {'q': msg.content}, httpOptions);
  }
}
