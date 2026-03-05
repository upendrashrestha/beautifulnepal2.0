export interface SendEmail {
  toEmail: string;
  subject: string;
  htmlContent: string;
}

export interface SendBulkEmail {
  toEmails: string[];
  subject: string;
  htmlContent: string;
}
