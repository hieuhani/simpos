import { useEffect, useMemo, useState } from 'react';
import { getOutputFileNames } from 'typescript';
import { dataService } from './data';
import { UOM } from './db';

export interface ProductProduct {
  id: number;
  defaultCode: string;
  barcode?: string;
  name: string;
  lstPrice: number;
  qtyAvailable: number;
  uomPoId: [number, string];
}

export const uomService = {
  getUoms(domain: Array<Array<any> | string> = []): Promise<UOM[]> {
    return dataService.searchRead({
      model: 'uom.uom',
      fields: [],
      domain,
      limit: 200,
    });
  },
};

export interface UseUom {
  uoms: UOM[];
  uomsDict: Record<string, UOM>;
}
export const useUom = (): UseUom => {
  const [uoms, setUoms] = useState<UOM[]>([]);
  const getUoms = async () => {
    const serverUoms = await uomService.getUoms();
    setUoms(serverUoms);
  };

  const uomsDict = useMemo<Record<string, UOM>>(() => {
    return uoms.reduce((prev, curr) => {
      return {
        ...prev,
        [curr.id]: curr,
      };
    }, {});
  }, [uoms]);
  useEffect(() => {
    getUoms();
  }, []);
  return { uoms, uomsDict };
};
