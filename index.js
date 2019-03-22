module.exports = {
  Query: {
    parse: function parseQuery(query, convertValues2TypesIfPossible, errorExtra = {}) {
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
      const cleanQueryOrError = initialize(errorExtra);
      return cleanQueryOrError.error ? cleanQueryOrError : parse(cleanQueryOrError);

      function parse(cleanQueryOrError) {
        let queryChars = cleanQueryOrError.split("");
        let result = {};
        let currentKey = "";
        let currentChar = "&";
        let prevChar = "";
        const convertAndCleanupResult = result =>
          Object.keys(result)
          .reduce((converted, key) =>
            ({
              ...converted,
              [key]: convertValues2TypesIfPossible ? tryParse2Type(cleanup(result[key])) : cleanup(result[key])
            }), {}
          );

        do {
          if ((currentChar === "&" && !/\s/.test(queryChars[0]) && prevChar !== "^")) {
            try {
              currentKey = tryParseKey(queryChars);
            } catch (error) {
              return {
                error: true,
                errorMssg: `Can't create key`,
                stack: error.stack
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
          currentChar = queryChars.shift();
        } while (queryChars[0]);
        
        currentChar && (result[currentKey] += currentChar);

        return convertAndCleanupResult(result);
      }

      function initialize(errorExtra) {
        let errorResult = {
          ...errorExtra,
          error: true,
        };

        try {
          query = decodeURIComponent(query.replace(/\+/g, " "));
        } catch {
          return {
            ...errorResult,
            message: `Decoding not possible or unspecified error for: ${query}`
          };
        }

        if (!/[&=]/g.test(query)) {
          return {
            ...errorResult,
            message: `${query} ... Does not seem to be a querystring`
          };
        }

        return query;
      }
    }
  }
}