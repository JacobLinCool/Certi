# Certi Cloudflare Workers

An configurable URL shortener for Certificates (and other things).

Running on Cloudflare Workers, using KV as the store.

## Usage

### Create a short URL

```sh
curl https://certi.jacob.workers.dev/create?cert=<certificate_url>&prefix=<prefix>
```

`cert`: The URL of the certificate.
`prefix`: The prefix of the short URL. (optional, length: 0-16)

success:

```json
{
  "success": true,
  "item": {
    "prefix": "jacob-",
    "key": "861523",
    "cert": "https://www.coursera.org/account/accomplishments/certificate/RZU3FVL3SWJ4",
    "del_code": "lpq9h2",
    "created": 1647366594944
  },
  "url": "https://certi.jacob.workers.dev/jacob-861523"
}
```

failed:

```json
{
  "success": false,
  "error": "Already Exists (or other error message)",
  "url": "https://certi.jacob.workers.dev/jacob-861523"
}
```

### Delete a short URL

```sh
curl /delete?key=<key>&del_code=<delete_code>
```

success:

```json
{
  "success": true,
  "item": {
    "cert": "https://www.coursera.org/account/accomplishments/certificate/RZU3FVL3SWJ4",
    "created": 1647366594944,
    "del_code": "lpq9h2",
    "key": "jacob-861523",
    "prefix": "jacob-"
  }
}
```

failed:

```json
{
  "success": false,
  "error": "Error Message"
}
```

See Certi for more details: <https://github.com/JacobLinCool/Certi>
