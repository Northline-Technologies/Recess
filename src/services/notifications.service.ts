import { pb } from './pocketbase';
import { Notification } from '@/types/models';

export const NotificationsService = {
  /**
   * Fetch in-app notifications for active user
   */
  async getNotifications(userId: string): Promise<Notification[]> {
    const records = await pb.collection('notifications').getFullList({
      filter: `user = "${userId}"`,
      sort: '-created',
    });
    return records as unknown as Notification[];
  },

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string): Promise<Notification> {
    const updated = await pb.collection('notifications').update(notificationId, {
      read_at: new Date().toISOString(),
    });
    return updated as unknown as Notification;
  },
};
