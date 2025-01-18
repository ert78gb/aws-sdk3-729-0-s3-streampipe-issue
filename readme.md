This is the reproduction repo of the `await s3Object.Body.transformToWebStream().pipeTo(Writable.toWeb(destinationStream))` breaks issue.

Steps:
 - clone the repo
 - use Node.js 22 or 23
 - run `npm ci`
 - run `docker compose up -d`
 - run `node --env-file=.env index.js`

Expected the flowing output console output
```
Uploaded successfully.
Downloaded successfully.
```

Instead of
```
Upload successfully.
Warning: Detected unsettled top-level await at ...
await s3Object.Body.transformToWebStream().pipeTo(Writable.toWeb(destinationStream))
```

Maybe the related Node.js issue https://github.com/nodejs/node/issues/56139 
BUT everything works fine with node 22 and 23 with `@aws-sdk/client-s3@3.726.1`
so an aws sdk modification breaks this.
