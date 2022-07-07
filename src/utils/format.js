import StringMask from 'string-mask';

const oneWeek = 604800000;
const oneMonth = 2629746000;
const day = 86400000;


export const isPhoneNumber = (phoneNumber) => /[+]?998\d{9}/i.test(phoneNumber);

export const isEmail = (email) => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(email).toLowerCase())

export const defineGranularity = (range) => {
    if (range) {
        const {from, to} = range;
        let diff = to.getTime() - from.getTime()
        if (diff <= 4*day) {
            return 'HOUR'
        } else if (diff > 4*day && diff <= 8*oneWeek) {
            return 'DAY'
        } else if (diff > 8*oneWeek && diff <= 5*oneMonth) {
            return 'WEEK'
        } else  {
            return 'MONTH'
        }
    }
    return 'DAY'
};


export const formatForGranularity = (granularity) => {
    switch (granularity) {
        case 'HOUR':
            return 'HH:mm';
        case 'DAY':
            return 'YYYY-MM-DD';
        case 'WEEK':
            return 'YYYY WW';
        case 'MONTH':
            return 'MMMMMM';
        default:
            return 'YYYY-MM-DD'
    }
};

export const containsUpperCaseLetter = (str) => {
    if (!str) return false;
    let counter = 0;
    while (counter < str.length) {
        let ch = str.charAt(counter);

        if (isNaN(Number(ch)) && ch === ch.toUpperCase()) {
            return true;
        }
        counter ++;
    }
    return false
};

export const containsLowerCaseLetter = (str) => {
    if (!str) return false;
    let counter = 0;
    while (counter < str.length) {
        let ch = str.charAt(counter);

        if (isNaN(Number(ch)) && ch === ch.toLowerCase()) {
            return true;
        }
        counter += 1;
    }
    return false
};


export function replaceAll(target, search, replacement) {
    if (!target) return '';
    return target.split(search).join(replacement);
}

Number.prototype.format = function(n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

export const formatPhoneNumber = (phoneNumber) => {
    let formatter = new StringMask('+(000) 00 000-00-00');
    return formatter.apply(phoneNumber);
};

export const formatPriceProduct = (price) => {
    const n = String(price),
      p = n.indexOf('.');

    return n.replace(
      /\d(?=(?:\d{3})+(?:\.|$))/g,
      (m, i) => p < 0 || i < p ? `${m} ` : m
    );
};
