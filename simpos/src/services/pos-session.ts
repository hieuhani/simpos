import { dataService } from './data';

export const posSessionService = {
  getSession(sessionId: number) {
    return dataService
      .call(
        'pos.session',
        'read',
        [
          [sessionId],
          [
            'id',
            'name',
            'user_id',
            'config_id',
            'start_at',
            'stop_at',
            'sequence_number',
            'payment_method_ids',
            'login_number',
            'state',
            'order_count',
            'total_payments_amount',
            'display_name',
          ],
        ],
        {},
      )
      .then((sessions: any) => {
        if (Array.isArray(sessions) && sessions.length > 0) {
          return sessions[0];
        }
        return null;
      });
  },

  closeSession(sessionId: number) {
    return dataService.call(
      'pos.session',
      'action_pos_session_closing_control',
      [[sessionId]],
      {},
    );
  },
};
