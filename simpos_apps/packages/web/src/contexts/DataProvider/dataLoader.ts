import { authService } from '../../services/auth';
import { updateSimApiToken } from '../../services/clients';
import { dataService } from '../../services/data';
import { AuthUserMeta, rootDb } from '../../services/db/root';

export interface LoadModelOption {
  userMeta?: AuthUserMeta;
  nocache?: boolean;
}

export interface LoadModel {
  model: string;
  fields: string[];
  load: (option?: LoadModelOption) => Promise<any>;
  indexes: string;
}

let syncWorker: Worker | undefined;

const fetchModelData = async (
  model: string,
  fields: string[],
  domain?: Array<any>,
  transform = (data: any) => data,
  options?: LoadModelOption,
): Promise<any> => {
  let currentModelData;

  const fetchRemoteData = () => {
    return dataService
      .searchRead({
        model,
        fields: fields.length > 0 ? [...fields, 'write_date'] : fields,
        domain,
      })
      .then(transform);
  };

  const revalidate = async () => {
    const remoteData = await fetchRemoteData();
    const localData = await rootDb.getByTableName(model);

    const localDataWriteDateDict = localData.reduce(
      (prev: object, curr: any) => {
        return {
          ...prev,
          [curr.id]: curr.writeDate,
        };
      },
      {},
    );
    const remoteDataToUpdate = remoteData.filter((row: any) => {
      return localDataWriteDateDict[row.id] !== row.writeDate;
    });
    if (remoteDataToUpdate.length > 0) {
      if (model === 'product.template' && syncWorker) {
        syncWorker.postMessage({
          type: 'PRODUCT_TEMPLATE_CHANGED',
          payload: remoteDataToUpdate,
        });
      }
      await rootDb.bulkUpdateTable(model, remoteData);
    }
  };

  if (!options?.nocache) {
    currentModelData = await rootDb.getByTableName(model);
  }
  if (currentModelData && currentModelData.length > 0) {
    revalidate();
    return currentModelData;
  }
  const remoteData = await fetchRemoteData();
  // store all remote data to the database
  await rootDb.bulkUpdateTable(model, remoteData);

  return remoteData;
};

export const loadModels: LoadModel[] = [
  {
    model: 'pos.config',
    fields: [],
    async load() {
      return fetchModelData(this.model, this.fields, [], (rows) => rows, {
        nocache: true,
      });
    },
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
      'state',
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
        {
          nocache: true,
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
      'street',
      'logo',
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
    model: 'restaurant.printer',
    fields: [
      'name',
      'proxy_ip',
      'product_categories_ids',
      'printer_type',
      'network_printer_ip',
    ],
  },
  {
    model: 'res.partner',
    indexes: '++id, phone, name',
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
      'sequence',
    ],
    async load() {
      return fetchModelData(this.model, this.fields, [], async (rows) => {
        const taxIds = rows.map((row: any) => row.id);
        const taxes = await dataService.call(
          'account.tax',
          'get_real_tax_amount',
          [taxIds],
          {},
        );

        if (Array.isArray(taxes)) {
          const taxesSet = taxes.reduce((prev, curr) => {
            return {
              ...prev,
              [curr.id]: curr.amount,
            };
          }, {});
          return rows.map((row: any) => {
            return {
              ...row,
              realTaxAmount: taxesSet[row.id],
            };
          });
        }

        return rows;
      });
    },
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
      'image_128',
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
      'name',
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
      'image_128',
    ],
    indexes: '++id, productTemplateId,barcode',
    async load() {
      return fetchModelData(
        this.model,
        this.fields,
        ['&', ['sale_ok', '=', true], ['available_in_pos', '=', true]],
        (rows) => {
          return rows.map((row: any) => ({
            ...row,
            productTemplateId: row.productTmplId ? row.productTmplId[0] : null,
          }));
        },
      );
    },
  },
  {
    model: 'pos.payment.method',
    fields: ['name', 'is_cash_count', 'use_payment_terminal'],
  },
  { model: 'account.fiscal.position', fields: [] },
  { model: 'account.fiscal.position.tax', fields: [] },
  { model: 'hr.employee', fields: ['name', 'id', 'user_id'] },
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
      'pos.order': 'id',
      'pos.order.line': '++id,orderId',
      'pos.order.snapshot': 'id',
      preference: 'id',
    },
  );

export const getSchemaIndexes = (schemaName: string) =>
  getDexieSchema()[schemaName];

export const syncData = async (userMeta?: AuthUserMeta, worker?: Worker) => {
  if (worker) {
    syncWorker = worker;
  }
  if (!userMeta) {
    userMeta = await authService.getAuthMeta();
    if (userMeta) {
      updateSimApiToken(userMeta);
    }
  }

  const loadModelsMap = getLoadModelsMap();
  const requiredKeys = getModelNames();
  await Promise.all(
    requiredKeys
      .map((key) => {
        if (!loadModelsMap[key]) {
          return null;
        }
        return loadModelsMap[key].load({
          userMeta,
        });
      })
      .filter(Boolean),
  );
};
