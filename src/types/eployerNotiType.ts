import { Account } from './accountType';
import { NOTI_TYPE } from './type';

export interface CreateNotiAccountRequest {
  content: string;
  link?: string;
  type?: string;
  receiverAccountId: number;
  title?: string;
}
export interface NotiAccount {
  id: number;
  content: string;
  isRead: number;
  time: string;
  title: string;
  link?: string;
  type?: NOTI_TYPE;
  account: Account;
}