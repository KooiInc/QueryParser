# QueryParser
Parse a querystring, maintaining '&amp;' or ''=' in values

This small library can parse a querystring  into a collection of key and value pairs where values may contain '&' or '=' (which wrecks the usual parsing).

example string: "?something=hithere & here I am&somethingelse=1=1&all ok"

Just make sure ampersands in a value are either postfixed with a whitespace character or prefixed with a ^. So the previous
example should be: "something=hithere & here I am&somethingelse=1=1^&all ok".

Parsing the example with this library results in:

```
{ something: 'hithere & here I am',
  somethingelse: '1=1&all ok' }
```

### Not a panacea
The library is not a panacea for all querystring problems one may encounter. If you want to circumvent querystring problems, don't use `GET` requests for keys with a lot of content in its value. In other words: keep your querystring as simple as possible and use `POST` for large queries. Alternatively you can use nodejs' `Querystring.parse`, using your own delimiters, or write your own parser for that. 
