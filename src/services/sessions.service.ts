import { pb } from './pocketbase';
import { Session } from '@/types/models';

export const SessionsService = {
  /**
   * Fetch upcoming scheduled sessions
   */
  async getUpcomingSessions(limit: number = 10): Promise<Session[]> {
    const result = await pb.collection('sessions').getList(1, limit, {
      filter: 'status = "scheduled" || status = "live"',
      sort: 'start_at',
      expand: 'host,class,group',
    });

    return result.items.map((item: any) => ({
      ...(item as unknown as Session),
      hostData: item.expand?.host,
    }));
  },

  /**
   * Fetch session details
   */
  async getSessionById(id: string): Promise<Session> {
    const item: any = await pb.collection('sessions').getOne(id, {
      expand: 'host,class,group',
    });
    return {
      ...(item as unknown as Session),
      hostData: item.expand?.host,
    };
  },
};
