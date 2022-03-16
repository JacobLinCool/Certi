# Certi

An URL shortener for Certificates.

The url of Coursera certificate is too long, and put it on resume is breaking the layout, so I created this url shortener.

<p align="center">
    <a href="#usage"> Usage </a> |
    <a href="#supported-certificates"> Supported Certificates </a> |
    <a href="#endpoints"> Endpoints </a>
</p>

## Usage

### Create a short URL

```sh
curl https://certi.jacoblin.cool/create?cert=<certificate_url>&prefix=<prefix>
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
  "url": "https://certi.jacoblin.cool/jacob-861523"
}
```

failed:

```json
{
  "success": false,
  "error": "Already Exists (or other error message)",
  "url": "https://certi.jacoblin.cool/jacob-861523"
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

## Supported Certificates

Now it only supports [Coursera](https://www.coursera.org/) certificates:

- `https://www.coursera.org/account/accomplishments/certificate/ABCDEFGHIJKL`
- `https://www.coursera.org/account/accomplishments/specialization/certificate/ABCDEFGHIJKL`

Feel free to open an issue or pull request if you want to support other certificates.

## Endpoints

- `cert.deta.dev`
- `certi.jacoblin.cool` (alias of `cert.deta.dev`)

You can also host this service on your own domain.
