<h1 align="center">endie</h1>
<p align="center">
  <em>Teach Express new tricks with fully type-enforced middleware plugins</em>
</p>

<p align="center">
  <a href="https://img.shields.io/badge/License-MIT-green.svg" target="_blank">
    <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="license" />
  </a>
  <a href="https://badge.fury.io/js/endie.svg" target="_blank">
    <img src="https://badge.fury.io/js/endie.svg" alt="npm version" />
  </a>
</p>

<p align="center">
  <span style="border: 1px solid #571313; padding: 10px 15px; color: #571313; background-color: #f5c1c1; border-radius: 5px;">
    WIP. Currently in beta.
  </span>
</p>

## Overview

Express middleware has no robust support for Typescript. Express middleware relies on either built-in ever-present properties like [`req.cookies`](http://expressjs.com/en/api.html#req.cookies) (i.e. [cookie-parser](https://github.com/expressjs/cookie-parser)), or on modifying the global type declarations of Express.js (i.e. [express-fileupload](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/express-fileupload)).

endie provides Express middleware behavior via a plugin system that is fully type-enforced, leaving nothing to guess-work, without any of these type workarounds.

## Usage Overview

This section shows a simple example of the usage of endie.

```typescript
import { createEndie, createPlugin } from 'endie'

// Plugin to parse the cookies of a request
const cookiePlugin = createPlugin()
  .setPre({
    exec: ({ req }) => ({ cookies: myCookieParser(req) }),
  })
  .build()

// Plugin to get the user making a request
const identityPlugin = createPlugin()
  .setPre({
    exec: ({ req }) => ({ user: myAuthService.identify(req) }),
  })
  .build()

// Plugin to log any errors after the handling of a request
const errorLoggingPlugin = createPlugin()
  .setPost({
    exec: ({ req, error }) => ({ user: myLoggingService.log(req, error) }),
  })
  .build()

const endie = createEndie()
  .addPlugin(cookiePlugin)
  .addPlugin(identityPlugin)
  .addPlugin(errorLoggingPlugin)

const endpoint = endie.create({
  logRequest: true,
  handler: async o => {
    console.log(o.m.cookies) // { cookies: ..., user: ...}
  }
})
```

## Contributing

See [./contributing/development.md](./contributing/development.md).