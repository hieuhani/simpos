import { dataService } from './data';

export interface RemotePartner {
  id: number;
  name: string;
  phone?: string;
  image128?: string;
}

export const partnerService = {
  createPartners(args: any[]) {
    return dataService.call('res.partner', 'create_from_ui', args, {});
  },
  getChateraise(): Promise<RemotePartner> {
    return dataService
      .searchRead({
        model: 'res.partner',
        fields: ['name', 'phone', 'image_128'],
        domain: [
          '&',
          ['company_id', '=', false],
          ['name', 'ilike', 'chateraise'],
        ],
        limit: 1,
      })
      .then((entities: any) => {
        if (Array.isArray(entities) && entities.length > 0) {
          return entities[0];
        }
        return null;
      });
  },
};
