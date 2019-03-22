# QueryParser
Parse a querystring, maintaining '&amp;' or ''=' in values

This small library can parse a querystring where values may contain '&' or '=' which wrecks the usual parsing.

example string: "?something=hithere & here I am&somethingelse=1=1&all ok"

Just make sure ampersands in a value are either postfixed with a whitespace character or prefixed with a ^. So the previous 
example should be: "something=hithere & here I am&somethingelse=1=1^&all ok". 

Parsing the example with this library results in: 

```
{ something: 'hithere & here I am',
  somethingelse: '1=1&all ok' }
```
