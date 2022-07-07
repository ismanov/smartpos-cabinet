import { useHistory, } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as R from 'ramda';

export const baseHook = () => { 
    let history = useHistory();
    let { t } = useTranslation();
    return { history, translation: t };
};

export const mergeHooks = R.pipe(
    (...args) => R.map(hook => hook, args),  
    R.filter(
      R.anyPass([
        R.is(Function), 
        R.allPass([
          R.is(Array), 
          hook => R.equals(2, R.length(hook)),
          hook => R.not(R.isNil(R.nth(1, hook))),
          hook => R.not(R.isEmpty(R.nth(1, hook))),
        ]),        
      ])
    ),
    R.map(R.ifElse((hook) => R.is(Array, hook), (hook) => hook[0](...hook[1]), (hook) => hook())),  
    R.mergeAll,
);