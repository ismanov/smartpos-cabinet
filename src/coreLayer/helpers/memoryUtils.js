import Cookies from 'js-cookie';
import * as R from 'ramda';

const cookie = R.pipe(
    R.assoc("get", (key) => Cookies.get(key)),
    R.assoc("set", (key, value) => Cookies.set(key, value)),
    R.assoc("remove", (key) => Cookies.remove(key)),    
);

export const cookieHelper = cookie({});

const storage = R.pipe(
    R.assoc("get", (key) => localStorage.getItem(key)),
    R.assoc("set", (key, value) => localStorage.setItem(key, value)),
    R.assoc("remove", (key) => localStorage.removeItem(key)),    
);

export const localStorageHelper = storage({});