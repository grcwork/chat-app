import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(public chatService: ChatService) { }
  users:string[] = [];

  currentUserYouChatWithId?: string;

  unreadMesagesUsersId: string[] = [];

  ngOnInit(): void {
    this.getActiveUsers();
    this.getCurrentUserYouChatWithId();
    this.getUnreadMesagesUsersId();
  }

  getCurrentUserYouChatWithId() {
    this.chatService.currentChatUserId$.subscribe((id) => {
      this.currentUserYouChatWithId = id;
    })
  }

  openChat(userFromChatId: string) {
    if (userFromChatId !== this.chatService.myUserId) {
      this.chatService.updateUserFromChat(userFromChatId);
    }
  }

  getActiveUsers() {
    this.chatService.getActiveUsers().subscribe((users) => {
      this.users = users;
    });
  }

  getUnreadMesagesUsersId() {
    this.chatService.unreadMessagesUsersId$.subscribe((users) => {
      this.unreadMesagesUsersId = users;
    });
  }
}
