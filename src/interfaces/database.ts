export interface ticketdata {
  logChannel: string;
  categories: {open: string, closed: string};
  supportRole: string;
  message: string;
  transcripts: string;
}

export interface join_leaveMessage {
  message: string;
  channel: string;
}