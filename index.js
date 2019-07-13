module.exports = {
  Query: {
    parse: parseQuery,
  }
};

function parseQuery(query, convertValues2TypesIfPossible, extraCollection = {}) {
  const tryParse2Type = value => {
    try {
      return JSON.parse(value);
    } catch (err) {
      return value;
    }
  };
  const tryParseKey = queryChars => {
    let key = "";
    let char = queryChars.shift();

    while (char && char !== "=") {
      key += char;
      char = queryChars.shift();
    }
    return key;
  };
  const cleanup = str => str.replace(/\^&/g, "&");
  const cleanQueryOrError = initialize(extraCollection);

  return cleanQueryOrError.error ? cleanQueryOrError : parse(cleanQueryOrError);

  function parse(cleanQuery) {
    let workingQuery = cleanQuery.trim().split("");
    let result = {};
    let currentKey = "";
    let currentChar = "&";
    let prevChar = "";
    const cleanupResult = result =>
      Object.keys(result)
        .reduce((converted, key) =>
          ({
            ...converted,
            [key]: convertValues2TypesIfPossible ? tryParse2Type(cleanup(result[key])) : cleanup(result[key])
          }), {}
        );

    while (workingQuery[0]) {
      if ((currentChar === "&" && !/\s/.test(workingQuery[0]) && prevChar !== "^")) {
        try {
          currentKey = tryParseKey(workingQuery);
        } catch (error) {
          return {
            ...extraCollection,
            error: true,
            initialString: query,
            errorMssg: `Key parsing failed`,
            stack: error.stack,
          };
        }
        result = {
          ...result,
          [currentKey]: ""
        };
      } else {
        result[currentKey] += currentChar;
      }
      prevChar = currentChar;
      currentChar = workingQuery.shift();
    }

    currentChar && (result[currentKey] += currentChar);

    return cleanupResult(result);
  }

  function initialize(extraCollection) {
    let errorResult = {
      ...extraCollection,
      error: true,
    };

    try {
      query = decodeURIComponent(query.replace(/\+/g, " "));
    } catch(error) {
      return {
        ...errorResult,
        initialQuery: query,
        message: `Decoding not possible or unspecified error`,
        stack: error.stack,
      };
    }

    if (!/[&=]/g.test(query)) {
      return {
        ...errorResult,
        initialQuery: query,
        message: `This query does not seem to be a querystring`
      };
    }

    return query;
  }
}
