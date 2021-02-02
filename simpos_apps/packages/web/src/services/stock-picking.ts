import { dataService } from './data';

export interface StockPicking {
  id: number;
  companyId: [number, string];
  displayName: string;
  locationDestId: [number, string];
  locationId: [number, string];
  moveType: string;
  name: string;
  note?: string;
  origin?: string;
  ownerId?: number;
  pickingTypeCode: 'incomming';
  pickingTypeId: [number, string];
  scheduledDate: string;
  showCheckAvailability: boolean;
  showMarkAsTodo: boolean;
  showReserved: boolean;
  showValidate: boolean;
  state: 'assigned' | 'done';
  isLocked: boolean;
  moveIdsWithoutPackage: number[];
}

export const stockPickingService = {
  validateStockPicking(stockPickingId: number) {
    return dataService.call(
      'stock.picking',
      'button_validate',
      [[stockPickingId]],
      {},
    );
  },
  getStockPicking(stockPickingId: number): Promise<StockPicking | null> {
    return dataService
      .call(
        'stock.picking',
        'read',
        [
          [stockPickingId],
          [
            'id',
            'is_locked',
            'show_mark_as_todo',
            'show_check_availability',
            'show_validate',
            'show_lots_text',
            'immediate_transfer',
            'picking_type_code',
            'show_operations',
            'show_reserved',
            'move_line_exist',
            'has_packages',
            'state',
            'picking_type_entire_packs',
            'has_scrap_move',
            'has_tracking',
            'name',
            'partner_id',
            'picking_type_id',
            'location_id',
            'location_dest_id',
            'backorder_id',
            'scheduled_date',
            'date_done',
            'origin',
            'owner_id',
            'move_line_nosuggest_ids',
            'package_level_ids_details',
            'move_line_ids_without_package',
            'move_ids_without_package',
            'package_level_ids',
            'move_type',
            'priority',
            'user_id',
            'group_id',
            'company_id',
            'note',
            'message_follower_ids',
            'activity_ids',
            'message_ids',
            'message_attachment_count',
            'display_name',
          ],
        ],
        {},
      )
      .then((entities: any) => {
        if (Array.isArray(entities) && entities.length > 0) {
          return entities[0];
        }
        return null;
      });
  },
};
