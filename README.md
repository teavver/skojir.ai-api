# Public api for [skojir.ai](https://skojir.ai)

# .env

### Local config
- `LOG` - 1= all, 0= off
- `ENV`
    - `DEV` - uses the test db collection, rate limiting off
    - `PROD`
- `PORT` - express

### External clients
- `OPENAI_KEY`
- `DB_URL`
- `DB_COLLECTION_PROD`
- `DB_COLLECTION_DEV`
- `MAILJET_API_KEY`
- `MAILJET_SECRET_KEY`

### External services
- `BACKEND_URL`

### Auth
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`

---
# App setup

1. `yarn install` in root dir
2. create `.env` file and config all keys
3. test locally with `yarn test`
4. run with `yarn main`

---
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

### (POST) `api/register` - Register a new user
Email must have a valid [TLD](https://data.iana.org/TLD/tlds-alpha-by-domain.txt)

Password must be 8 chars min, min 1 upper + lower, min 1 special char

On success, an email will be sent to the user. They will need to verify their account using the /verify endpoint in order to log in. Verification code expires after 10 minutes and requires re-generating it using the `"resend": true` property in the [`/auth/verify`](#post-apiauthverify---verify-account-with-code-or-resend-code) request body.

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
    "email": "email",
    "img": "base64 encoded image",
    "threshold?": 0.25,
    "outputFormat": "minimal or standard"
}
```

### 🔒 (POST) `api/email-otp` - Get OTP code to change email
A request body with email is required to identify the user based on accessToken
```json
{
    "email": "email"
}
```

### 🔒 (POST) `api/email-change` - Change email for an account
Requires accessToken, the account to be verified and the OTP code from `api/email-otp`. Will send an email to the old address on success

```json
{
    "email": "yourNewEmail",
    "verificationCode": "6 digit OTP code",
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

### (POST) `api/auth/verify` - Verify account with code or resend code
Used to verify registered users to finish up creating the account. Requires the 6-digit code from registration email:
```json
{
    "email": "email",
    "verificationCode": "228822"
}
```
#### Requesting new codes
The same endpoint can also be used to **re-send the verification code** - generate a new code & resend the email:
```json
{
    "email": "userEmail",
    "verificationCode": "w/e",
    "resend": true
}
```

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

