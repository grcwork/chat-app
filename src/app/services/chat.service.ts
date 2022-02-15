import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;

  private currentChatUserId: BehaviorSubject<string> = new BehaviorSubject<string>("");
  public currentChatUserId$: Observable<string> = this.currentChatUserId.asObservable();

  private unreadMessagesUsersId: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  public unreadMessagesUsersId$: Observable<string[]> = this.unreadMessagesUsersId.asObservable(); 

  public myUserId?: string;

  constructor() { 
    this.socket = io("http://localhost:3000/")
  }

  updateUserFromChat(id: string) {
    this.currentChatUserId.next(id);
  }

  addUnreadMessagesUserId(id: string) {
    let alreadyIn: boolean = false;
    for (let _id of this.unreadMessagesUsersId.value) {
      if (_id === id) {
        alreadyIn = true;
      }
    }
    if (!alreadyIn) {
      this.unreadMessagesUsersId.next([...this.unreadMessagesUsersId.value, id])
    }
  }

  removeUnreadMessagesUserId(id: string) {
    let unreadMessagesUserIdCopy = [...this.unreadMessagesUsersId.value];
    for (let i = 0; i < unreadMessagesUserIdCopy.length; i++) {
      if (unreadMessagesUserIdCopy[i] === id) {
        unreadMessagesUserIdCopy.splice(i, 1);
        break;
      }
    }
    this.unreadMessagesUsersId.next(unreadMessagesUserIdCopy);
  }

  public sendMessage(message: Object) {
    this.socket.emit("privateChatMessage", message);
  }

  public getActiveUsers(): Observable<string[]> {
    let observable = new Observable<string[]>(observer => {
      this.socket.on("activeUsers", (data) => {
        observer.next(data);
        this.myUserId = this.socket.id;
      })
    });
    return observable;
  }

  public getMessagesFromPrivateChat(): Observable<{sender: string, message: string}> {
    let observable = new Observable<{sender: string, message: string}>(observer => {
      this.socket.on("dm", (data) => {
        observer.next(data);
      })
    });
    return observable;
  }
}
