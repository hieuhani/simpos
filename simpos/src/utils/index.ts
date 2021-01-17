import { sprintf } from 'sprintf-js';

const databaseParameters: any = {
  code: 'en_US',
  dateFormat: '%m/%d/%Y',
  decimalPoint: '.',
  direction: 'ltr',
  grouping: [3, 0],
  id: 1,
  name: 'English (US)',
  thousandsSep: ',',
  timeFormat: '%H:%M:%S',
  weekStart: 7,
};
/**
 * performs a half up rounding with arbitrary precision, correcting for float loss of precision
 * See the corresponding float_round() in server/tools/float_utils.py for more info
 *
 * @param {number} value the value to be rounded
 * @param {number} precision a precision parameter. eg: 0.01 rounds to two digits.
 */
export function roundPrecision(value: number, precision: number) {
  if (!value) {
    return 0;
  } else if (!precision || precision < 0) {
    precision = 1;
  }
  let normalizedValue = value / precision;
  const epsilonMagnitude = Math.log(Math.abs(normalizedValue)) / Math.log(2);
  const epsilon = Math.pow(2, epsilonMagnitude - 52);
  normalizedValue += normalizedValue >= 0 ? epsilon : -epsilon;

  /**
   * Javascript performs strictly the round half up method, which is asymmetric. However, in
   * Python, the method is symmetric. For example:
   * - In JS, Math.round(-0.5) is equal to -0.
   * - In Python, round(-0.5) is equal to -1.
   * We want to keep the Python behavior for consistency.
   */
  const sign = normalizedValue < 0 ? -1.0 : 1.0;
  const rounded_value = sign * Math.round(Math.abs(normalizedValue));
  return rounded_value * precision;
}

/**
 * performs a half up rounding with a fixed amount of decimals, correcting for float loss of precision
 * See the corresponding float_round() in server/tools/float_utils.py for more info
 * @param {Number} value the value to be rounded
 * @param {Number} decimals the number of decimals. eg: round_decimals(3.141592,2) -> 3.14
 */
export function roundDecimals(value: number, decimals: number) {
  /**
   * The following decimals introduce numerical errors:
   * Math.pow(10, -4) = 0.00009999999999999999
   * Math.pow(10, -5) = 0.000009999999999999999
   *
   * Such errors will propagate in round_precision and lead to inconsistencies between Python
   * and JavaScript. To avoid this, we parse the scientific notation.
   */
  return roundPrecision(value, parseFloat('1e' + -decimals));
}

/**
 * Intersperses ``separator`` in ``str`` at the positions indicated by
 * ``indices``.
 *
 * ``indices`` is an array of relative offsets (from the previous insertion
 * position, starting from the end of the string) at which to insert
 * ``separator``.
 *
 * There are two special values:
 *
 * ``-1``
 *   indicates the insertion should end now
 * ``0``
 *   indicates that the previous section pattern should be repeated (until all
 *   of ``str`` is consumed)
 *
 * @param {String} str
 * @param {Array<Number>} indices
 * @param {String} separator
 * @returns {String}
 */
export function intersperse(
  str: string,
  indices: number[],
  separator: string = '',
) {
  var result = [],
    last = str.length;

  for (var i = 0; i < indices.length; ++i) {
    var section = indices[i];
    if (section === -1 || last <= 0) {
      // Done with string, or -1 (stops formatting string)
      break;
    } else if (section === 0 && i === 0) {
      // repeats previous section, which there is none => stop
      break;
    } else if (section === 0) {
      // repeat previous section forever
      //noinspection AssignmentToForLoopParameterJS
      section = indices[--i];
    }
    result.push(str.substring(last - section, last));
    last -= section;
  }

  var s = str.substring(0, last);
  if (s) {
    result.push(s);
  }
  return result.reverse().join(separator);
}

/**
 * Insert "thousands" separators in the provided number (which is actually
 * a string)
 *
 * @param {String} num
 * @returns {String}
 */
export function insertThousandSeps(num: string) {
  var negative = num[0] === '-';
  num = negative ? num.slice(1) : num;
  return (
    (negative ? '-' : '') +
    intersperse(
      num,
      databaseParameters.grouping,
      databaseParameters.thousandsSep,
    )
  );
}

/**
 * Returns a human readable number (e.g. 34000 -> 34k).
 *
 * @param {number} number
 * @param {integer} [decimals=0]
 *        maximum number of decimals to use in human readable representation
 * @param {integer} [minDigits=1]
 *        the minimum number of digits to preserve when switching to another
 *        level of thousands (e.g. with a value of '2', 4321 will still be
 *        represented as 4321 otherwise it will be down to one digit (4k))
 * @param {function} [formatterCallback]
 *        a callback to transform the final number before adding the
 *        thousands symbol (default to adding thousands separators (useful
 *        if minDigits > 1))
 * @returns {string}
 */
export function humanNumber(
  number: number,
  decimals = 0,
  minDigits = 1,
  formatterCallback: any,
) {
  number = Math.round(number);
  decimals = decimals | 0;
  minDigits = minDigits || 1;
  formatterCallback = formatterCallback || insertThousandSeps;

  var d2 = Math.pow(10, decimals);
  var val = 'kMGTPE';
  var symbol = '';
  var numberMagnitude = Number(number.toExponential().split('e')[1]);
  // the case numberMagnitude >= 21 corresponds to a number
  // better expressed in the scientific format.
  if (numberMagnitude >= 21) {
    // we do not use number.toExponential(decimals) because we want to
    // avoid the possible useless O decimals: 1e.+24 preferred to 1.0e+24
    number = Math.round(number * Math.pow(10, decimals - numberMagnitude)) / d2;
    // formatterCallback seems useless here.
    return number + 'e' + numberMagnitude;
  }
  var sign = Math.sign(number);
  number = Math.abs(number);
  for (var i = val.length; i > 0; i--) {
    var s = Math.pow(10, i * 3);
    if (s <= number / Math.pow(10, minDigits - 1)) {
      number = Math.round((number * d2) / s) / d2;
      symbol = val[i - 1];
      break;
    }
  }
  number = sign * number;
  return formatterCallback('' + number) + symbol;
}

/**
 * Returns a string representing a float.  The result takes into account the
 * user settings (to display the correct decimal separator).
 *
 * @param {float|false} value the value that should be formatted
 * @param {Object} [field] a description of the field (returned by fields_get
 *   for example).  It may contain a description of the number of digits that
 *   should be used.
 * @param {Object} [options] additional options to override the values in the
 *   python description of the field.
 * @param {integer[]} [options.digits] the number of digits that should be used,
 *   instead of the default digits precision in the field.
 * @param {function} [options.humanReadable] if returns true,
 *   formatFloat acts like utils.human_number
 * @returns {string}
 */
export function formatFloat(
  value: number | false,
  field: any,
  options: any = {},
): string {
  options = options || {};
  if (value === false) {
    return '';
  }
  if (options.humanReadable && options.humanReadable(value)) {
    return humanNumber(
      value,
      options.decimals,
      options.minDigits,
      options.formatterCallback,
    );
  }
  var precision;
  if (options.digits) {
    precision = options.digits[1];
  } else if (field && field.digits) {
    precision = field.digits[1];
  } else {
    precision = 2;
  }
  var formatted = sprintf('%.' + precision + 'f', value || 0).split('.');
  formatted[0] = insertThousandSeps(formatted[0]);
  return formatted.join(databaseParameters.decimalPoint);
}

export function zeroPad(num: number, size: number) {
  var s = '' + num;
  while (s.length < size) {
    s = '0' + s;
  }
  return s;
}

export function formatMoney(number: number = 0) {
  return `${number.toLocaleString('vi')}đ`;
}
