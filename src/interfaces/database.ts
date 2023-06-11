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

export interface joinleaveImage {
  backgroundColor: string;
  image: string;
  textColor: string;
  shadow: string;
  shadowColor: string;
}