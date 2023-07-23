export interface ticketdata {
  logChannel: string;
  categories: {open: string, closed: string};
  supportRole: string;
  message: string;
  transcripts: string;
}

export interface memberCount{
  channel: string;
  text: string;
}

export interface joinleaveMessage {
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

export interface countingData {
  channel: string;
  count: number;
  maxcount: number;
}