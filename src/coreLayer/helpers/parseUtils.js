import * as R from 'ramda';

export const safeParseToObj =  R.tryCatch(
    R.ifElse(
      R.anyPass([R.isEmpty, R.isNil]),
      R.always(null), 
      (str) => JSON.parse(str)
    ), (_, str) => str
);

export const safeParseToString = R.ifElse(
    R.anyPass([R.isEmpty, R.isNil]),
    R.always(null),
    R.ifElse(
      R.is(String),
      (str) => str,
      (str) => JSON.stringify(str)
    )
);
