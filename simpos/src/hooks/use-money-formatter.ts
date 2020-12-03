import keyBy from 'lodash.keyby';
import { useMemo } from 'react';
import { useData } from '../contexts/DataProvider';
import { DecimalPrecision } from '../services/db';
import { formatFloat, roundDecimals } from '../utils';

interface DictionaryOf<T> {
  [key: string]: T | undefined;
}
interface MoneyFormatter {
  formatCurrency: (amount: number, decimalPrecisionName?: string) => string;
  formatCurrencyNoSymbol: (
    amount: number,
    decimalPrecisionName?: string,
  ) => string;
}
export function useMoneyFormatter(): MoneyFormatter {
  const data = useData();

  const decimalPrecisionsDict = useMemo<DictionaryOf<DecimalPrecision>>(
    () => keyBy(data.decimalPrecisions, 'name'),
    [data.decimalPrecisions],
  );
  const currency = data.posConfig.currency;

  function formatCurrencyNoSymbol(
    amount: number,
    decimalPrecisionName?: string,
  ) {
    let { decimals } = currency;
    if (decimalPrecisionName && decimalPrecisionsDict[decimalPrecisionName]) {
      decimals = decimalPrecisionsDict[decimalPrecisionName]!.digits;
    }
    let newAmount = roundDecimals(amount, decimals).toFixed(decimals);
    newAmount = formatFloat(roundDecimals(amount, decimals), {
      digits: [69, decimals],
    });

    return newAmount;
  }

  function formatCurrency(amount: number, decimalPrecisionName?: string) {
    const formattedAmount = formatCurrencyNoSymbol(
      amount,
      decimalPrecisionName,
    );

    const segments = [formattedAmount, currency.symbol].filter(Boolean);

    return currency.position === 'after'
      ? segments.join(' ')
      : segments.reverse().join(' ');
  }
  return {
    formatCurrency,
    formatCurrencyNoSymbol,
  };
}
