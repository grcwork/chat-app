import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent implements OnInit {

  @Input()
  isUserMessage!: Boolean;

  @Input()
  text!: String;

  currentChatUserId?: string; 

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.getCurrentUserFromChat();
  }

  getCurrentUserFromChat() {
    this.chatService.currentChatUserId$.subscribe((user) => {
      this.currentChatUserId = user;
    })
  }

}
