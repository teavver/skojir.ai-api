# Api for [skojir.ai](https://skojir.ai)

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/teavver/skojir.ai-api/build-and-test.yml)

# App setup

1. `git clone https://github.com/teavver/skojir.ai-api && cd skojir.ai-api`
1. `yarn`
2. create `.env` file and config all keys
3. test locally with
    1. `yarn test-core` for core functionality and
    2. `yarn test-services` for external services
4. run locally with `yarn main` or [run with Docker](#running-as-a-docker-image)

# Running in self-update mode

### The self-update mode allows GitHub to trigger seamless, automatic app update & restart logic
### Updates only occur on main branch changes, and will be cancelled if GH workflow fails.

1. `npm i pm2 -g`
2. `yarn build`
3. `pm2 startup systemd`
4. `pm2 start ecosystem.config.cjs`
5. `pm2 save`
6. `pm2 monit`
7. `pm2 logs skojir-api --lines 200 --out`

# Running as a Docker image

1. `docker build --build-arg ENV_FILE=./.env -t name .`
2. `docker run -p PORT:PORT name`\
**Make sure your PORT matches the one in .env**

# .env
### Misc
- `LOG` - log mode
    - 0: all off
    - 1: log everything
    - 2: log and save to logfile
    - 3: (DEBUG MODE): log only warnings and errors
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

### Github
- `GH_WEBHOOK_KEY`

---
# Endpoints

## Legend
- 🔒 -> Protected endpoint (Requires JWT authentication)
- 🔑 -> Returns JWT

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

On success, an email will be sent to the user. They will need to verify their account using the /verify endpoint in order to log in.\
Verification code (otp) expires after 10 minutes and requires re-generating it using the `"resend": true` property in the [`/auth/verify`](#post-apiauthverify---verify-account-with-code-or-resend-code) request body.

```json
{
    "email": "email@gmail.com",
    "password": "yourPassword!",
}
```

### 🔒 (GET) `api/account-info` - Get information about own account

Will always return `email` and, if purchased, `membership` details.\
Example response (no membership):
```json
    "data": {
        "email": "email@gmail.com"
    }
```

Response for User with active (or expired) membership:
```json
    "data": {
        "email": "email@gmail.com",
        "membership": {
            "userId": null, // ALWAYS NULL
            "isActive": true,
            "endDate": "Membership status expiry date"
        }
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

### 🔒 (GET) `api/email-change-otp` - Get OTP code to change email

Every OTP code is valid for 10 minutes after its sent. If it's expired, you can use this endpoint again to override the old one with a new one.

### 🔒 (POST) `api/email-change` - Change email for an account
Requires accessToken, the account to be verified and the OTP code from `api/email-otp`.\
Will throw if the new email is already taken by another user. \
Will send a notification email to both addresses on success.

```json
{
    "email": "yourNewEmail",
    "otp": "6 digit OTP code",
}
```

### 🔒 (POST) `api/delete` - Delete user account
User account will be deleted **immediately** on success (!)
```json
{
    "password": "pwd"
}
```

## Auth endpoints

### 🔒 (POST) `api/auth/refresh` - Refresh auth JWTs using `refreshToken`

Requires a valid `refreshToken` in the request cookies.\
If the User sends an invalid or expired `refreshToken`, the api will automatically reject the request and revoke the session.

### (POST) `api/auth/verify` - Verify account with code or resend code
Used to verify registered users to finish up creating the account. Requires the 6-digit code from registration email:
```json
{
    "email": "email",
    "otp": "228822"
}
```
#### Requesting new codes
The same endpoint can also be used to **re-send the verification code** - generate a new code & resend the email:
```json
{
    "email": "userEmail",
    "otp": "w/e",
    "resend": true
}
```

### 🔑 (POST) `api/auth/login` - Login to verfied account

Grants `refreshToken`, `accessToken` and `membershipToken` (if the user has an active membership) JWTs on success.\
The `refreshToken` is always returned as httpOnly cookie.\
User sessions are stored per device. The user is allowed to sign out of all devices at any time.

Token type and expiration time:
- `refreshToken` = **14 days**
- `accessToken` = **12 hours**
- `membershipToken` = **12 hours**

```json
{
    "email": "email",
    "password": "pwd",
    "deviceId": "16-byte device UUID"
}
```