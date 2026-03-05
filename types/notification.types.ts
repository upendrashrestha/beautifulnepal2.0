/* =============================
   Notification Preferences
   ============================= */

// Preferences are now a key-value map using the enum
export type NotificationPreferences = Record<NotificationType, boolean>;

/* =============================
   Notification Types
   ============================= */

export enum NotificationType {
  LeadAssigned = "LeadAssigned",
  MessageReceived = "MessageReceived",
  LeadCreated = "LeadCreated",
  EventReceived = "EventReceived",
  EmailNotificationOn = "EmailNotificationOn",
}

/* =============================
   Base Notification
   ============================= */

interface BaseNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  clientId: string;
  userId?: string;
  createdOn: string;
}

/* =============================
   Event-specific payloads
   ============================= */

export interface LeadAssignedNotification extends BaseNotification {
  type: NotificationType.LeadAssigned;
  data: {
    leadId: string;
  };
}

export interface MessageReceivedNotification extends BaseNotification {
  type: NotificationType.MessageReceived;
  data: {
    messageId: string;
    fromUserId: string;
  };
}

/* Add new notification types here as needed */
export interface LeadCreatedNotification extends BaseNotification {
  type: NotificationType.LeadCreated;
  data: {
    leadId: string;
    assignedBy: string;
  };
}

/* =============================
   Union Types
   ============================= */

export type NotificationEvent =
  | LeadAssignedNotification
  | MessageReceivedNotification
  | LeadCreatedNotification;

/* =============================
   Legacy / External Event Mapping
   ============================= */

export type MessageCreatedEvent = {
  Body: string;
  ClientId: string;
  CreatedOn: string;
  Data: string;
  Title: string;
  Type: string;
  UserId: string;
};
