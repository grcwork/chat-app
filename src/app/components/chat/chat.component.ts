import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms'
import { Message } from '../../models/Message';
import { Chat } from '../../models/Chat';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @Input()
  chats: Chat[] = [];

  openChatIndex!: number;
  
 sendMessageForm = this.formBuilder.group({
   text: ''
 });

  currentUserYouChatWithId?: string; 

  constructor(private formBuilder: FormBuilder, private chatService: ChatService) { }

  ngOnInit(): void {
    this.getCurrentUserFromChat();
    this.getMessagesFromPrivateChat();
  }

  getCurrentUserFromChat() {
    this.chatService.currentChatUserId$.subscribe((user) => {
      this.currentUserYouChatWithId = user;

      let chatExists: boolean = false;
      for (let i = 0; i < this.chats.length; i++) {
        if (this.chats[i].userYouChatWithId === this.currentUserYouChatWithId) {
          this.openChatIndex = i;
          console.log(this.chats)
          chatExists = true;
        }
      }
      if (!chatExists) {
        const newChat: Chat = {userYouChatWithId: this.currentUserYouChatWithId, messages: []}
        this.chats.push(newChat);
        this.openChatIndex = this.chats.length-1;
      }
    })
  }

  getMessagesFromPrivateChat() {
    this.chatService.getMessagesFromPrivateChat().subscribe((message) => {
      let chatExists: boolean = false;
      for (let i = 0; i < this.chats.length; i++) {
        if (this.chats[i].userYouChatWithId === message.sender) {
          this.chats[i].messages.push({isUserMessage: false, text: message.message});
          chatExists = true;
        }
      }
      if (!chatExists) {
        const newChat: Chat = {userYouChatWithId: message.sender, messages: [{isUserMessage: false, text: message.message}]}
        this.chats.push(newChat);
      }
    })
  }

  ngAfterViewChecked() {        
    let chatMessageContainer = document.querySelector(".chat-messages-container");
    chatMessageContainer!.scrollTop = chatMessageContainer!.scrollHeight;   
  } 

  onSubmit(): void {
    if (this.sendMessageForm.dirty && this.sendMessageForm.valid) {
      let newMessage: Message = { isUserMessage: true, text: this.sendMessageForm.get("text")!.value };

      let chatExists: boolean = false;
      for (let i = 0; i < this.chats.length; i++) {
        if (this.chats[i].userYouChatWithId === this.currentUserYouChatWithId) {
          this.chats[i].messages.push(newMessage);
          chatExists = true;
        }
      }
      if (!chatExists) {
        const newChat: Chat = {userYouChatWithId: this.currentUserYouChatWithId!, messages: [newMessage]}
        this.chats.push(newChat);
      }

      this.sendMessageForm.reset();
      this.chatService.sendMessage({receiverId: this.currentUserYouChatWithId, messageText: newMessage.text});
    }
  }
}