import { dataService } from '../../services/data';
import { rootDb } from '../../services/db/root';

interface LoadModel {
  model: string;
  fields: string[];
  load: () => Promise<any>;
}

const fetchModelData = async (
  model: string,
  fields: string[],
): Promise<any> => {
  const currentModelData = await rootDb.getByTableName(model);
  console.log(currentModelData);
  if (currentModelData) {
    return currentModelData;
  }
  const remoteData = await dataService.searchRead({
    model,
    fields: fields.length > 0 ? [...fields, 'write_date'] : fields,
  });
  // store remote data to the local database
  // await db.setItem(model, remoteData);
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
    ],
    async load() {
      return fetchModelData(this.model, this.fields);
    },
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
    model: 'product.pricelist',
    fields: ['name', 'display_name', 'discount_policy'],
  },
  {
    model: 'product.pricelist.item',
    fields: [],
  },
  {
    model: 'res.currency',
    fields: ['name', 'symbol', 'position', 'rounding', 'rate'],
  },
  { model: 'pos.category', fields: ['id', 'name', 'parent_id', 'child_id'] },
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
  },
  {
    model: 'pos.payment.method',
    fields: ['name', 'is_cash_count', 'use_payment_terminal'],
  },
  { model: 'account.fiscal.position', fields: [] },
  { model: 'account.fiscal.position.tax', fields: [] },
].map((loadModel) => {
  if (typeof loadModel.load === 'function') {
    return loadModel as LoadModel;
  }
  return {
    ...loadModel,
    load: () => fetchModelData(loadModel.model, loadModel.fields),
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
