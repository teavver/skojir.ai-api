# skojir.ai-public-api

## .env

### Local config
- `ENV` - `DEV` or `PROD` - app environment
- `PORT` - express

### External clients
- `OPENAI_KEY`
- `DB_URL_PROD`
- `DB_URL_DEV`
- `DB_COLLECTION` - collection name should be the same for prod/dev envs
- `MAILJET_API_KEY`
- `MAILJET_SECRET_KEY`

### External services
- `BACKEND_URL` - url to GCF

### Auth
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`

# Endpoints

## Legend
- 🔒 -> Requires JWT
- 🔑 -> Returns new JWT

## General

### (GET): api/ - Root
### (GET): api/status - Get status of all services
- API status
- DB status
- OpenAI status
- Backend module status

## User account related endpoints
### (POST) api/register - Register a new user
Email must have a valid [TLD](https://data.iana.org/TLD/tlds-alpha-by-domain.txt)

Password must be 8 chars min, min 1 upper + lower, min 1 special char

On success, an email will be sent to the user. They will need to verify their account using the /verify endpoint in order to log in. Verification code expires after 10 minutes and requires re-generating it using the [/re-verify](#post-apiauthre-verify---resend-verification-code) endpoint.

```json
{
    "email": "youraccount@mail.com",
    "password": "yourPassword!"
}
```

### 🔒 (POST) `api/solve` - Solver route for users with membership
Threshold must be between 0.1 and 0.5, defaults to 0.25
```json
{
    "img": "base64 encoded image",
    "threshold?": 0.25,
    "outputFormat": "minimal or standard"
}
```

### 🔒 (POST) `api/delete` - Delete user account
User account will be deleted **immediately** on success (!)
```json
{
    "email": "email",
    "password": "pwd"
}
```

## Auth endpoints

### (POST) `api/auth/verify` - Verify account
Used to verify registered users to finish up creating the account. Requires the 6-digit code from registration email.
```json
{
    "email": "email",
    "verificationCode": "228822"
}
```

### (POST) `api/auth/re-verify` - Resend verification code
Can only be used if the account if unverified and there's an existing verificationCode and is expired.
TODO

### 🔑 (POST) `api/auth/login` - Login to verfied account
Grants two JWTs on success:
- accessToken (expires in 1h)
- refreshToken (expires in 1y)

```json
{
    "email": "email",
    "password": "pwd"
}
```

