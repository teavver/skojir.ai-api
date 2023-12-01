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