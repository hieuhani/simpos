import { dataService } from '../../services/data';
import { AuthUserMeta, rootDb } from '../../services/db/root';

export interface LoadModelOption {
  userMeta: AuthUserMeta;
}
export interface LoadModel {
  model: string;
  fields: string[];
  load: (option?: LoadModelOption) => Promise<any>;
  indexes: string;
}

const fetchModelData = async (
  model: string,
  fields: string[],
  domain?: Array<any>,
  transform = (data: any) => data,
): Promise<any> => {
  const currentModelData = await rootDb.getByTableName(model);
  if (currentModelData && currentModelData.length > 0) {
    return currentModelData;
  }
  const remoteData = await dataService
    .searchRead({
      model,
      fields: fields.length > 0 ? [...fields, 'write_date'] : fields,
      domain,
    })
    .then(transform);
  await rootDb.bulkUpdateTable(model, remoteData);

  return remoteData;
};

export const loadModels: LoadModel[] = [
  {
    model: 'pos.config',
    fields: [],
  },
  {
    model: 'pos.session',
    fields: [
      'id',
      'name',
      'user_id',
      'config_id',
      'start_at',
      'stop_at',
      'sequence_number',
      'payment_method_ids',
      'login_number',
    ],
    async load() {
      return fetchModelData(
        this.model,
        this.fields,
        [
          ['state', '=', 'opened'],
          ['rescue', '=', false],
        ],
        (rows) => {
          return rows.map((row: any) => ({
            ...row,
            posConfigId: row.configId ? row.configId[0] : null,
            responsibleUserId: row.userId ? row.userId[0] : null,
          }));
        },
      );
    },
    indexes: '++id, name',
  },
  {
    model: 'res.company',
    fields: [
      'currency_id',
      'email',
      'website',
      'company_registry',
      'vat',
      'name',
      'phone',
      'partner_id',
      'country_id',
      'state_id',
      'tax_calculation_rounding_method',
    ],
  },
  {
    model: 'decimal.precision',
    fields: ['name', 'digits'],
  },
  {
    model: 'res.partner',
    fields: [
      'name',
      'street',
      'city',
      'vat',
      'phone',
      'mobile',
      'email',
      'barcode',
      'comment',
      'property_account_position_id',
      'property_product_pricelist',
    ],
  },
  {
    model: 'uom.uom',
    fields: [],
  },
  {
    model: 'account.tax',
    fields: [
      'name',
      'amount',
      'price_include',
      'include_base_amount',
      'amount_type',
      'children_tax_ids',
    ],
  },
  {
    model: 'res.users',
    fields: ['name', 'company_id', 'id', 'groups_id'],
  },
  {
    model: 'product.pricelist',
    fields: ['name', 'display_name', 'discount_policy'],
  },
  {
    model: 'product.pricelist.item',
    fields: [],
    indexes: '++id, pricelistId',
  },
  {
    model: 'res.currency',
    fields: ['name', 'symbol', 'position', 'rounding', 'rate'],
  },
  { model: 'pos.category', fields: ['id', 'name', 'parent_id', 'child_id'] },
  {
    model: 'product.template',
    fields: [
      'name',
      'description',
      'type',
      'lst_price',
      'list_price',
      'sequence',
      'product_variant_ids',
      'product_variant_id',
      'barcode',
      'default_code',
      'pos_categ_id',
    ],
    indexes: '++id, posCategoryId',
    async load() {
      return fetchModelData(
        this.model,
        this.fields,
        ['&', ['sale_ok', '=', true], ['available_in_pos', '=', true]],
        (rows) => {
          return rows.map((row: any) => ({
            ...row,
            posCategoryId: row.posCategId ? row.posCategId[0] : null,
          }));
        },
      );
    },
  },
  {
    model: 'product.product',
    fields: [
      'display_name',
      'lst_price',
      'standard_price',
      'categ_id',
      'pos_categ_id',
      'taxes_id',
      'barcode',
      'default_code',
      'to_weight',
      'uom_id',
      'description_sale',
      'description',
      'product_tmpl_id',
      'tracking',
      'sequence',
    ],
    async load() {
      return fetchModelData(this.model, this.fields, [
        '&',
        ['sale_ok', '=', true],
        ['available_in_pos', '=', true],
      ]);
    },
  },
  {
    model: 'pos.payment.method',
    fields: ['name', 'is_cash_count', 'use_payment_terminal'],
  },
  { model: 'account.fiscal.position', fields: [] },
  { model: 'account.fiscal.position.tax', fields: [] },
].map((loadModel) => {
  return {
    ...loadModel,
    load:
      typeof loadModel.load === 'function'
        ? loadModel.load
        : () => fetchModelData(loadModel.model, loadModel.fields),
    indexes: loadModel.indexes ? loadModel.indexes : '++id',
  };
});

export const getLoadModelsMap = (): Record<string, LoadModel> =>
  loadModels.reduce((prev, current) => {
    return {
      ...prev,
      [current.model]: current,
    };
  }, {});

export const getModelNames = () => Object.keys(getLoadModelsMap());

export const getDexieSchema = (): Record<string, string> =>
  loadModels.reduce(
    (prev, current) => {
      return {
        ...prev,
        [current.model]: current.indexes,
      };
    },
    {
      'auth.user.metas': '++id,name,dbName,username',
      'pos.order': 'id, posSessionId',
      'pos.order.line': '++id,orderId',
    },
  );

export const getSchemaIndexes = (schemaName: string) =>
  getDexieSchema()[schemaName];
