# TCC E-Voting System Backend

This is the backend API for the TCC E-Voting System.

## Deployment to Heroku

1. Install the Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Login to Heroku: `heroku login`
3. Create a new Heroku app: `heroku create your-app-name`
4. Set environment variables:
   ```
   heroku config:set FIREBASE_SERVICE_ACCOUNT_KEY="your-service-account-key-json"
   ```
5. Deploy: `git push heroku master`

## Environment Variables

- `FIREBASE_SERVICE_ACCOUNT_KEY` - Firebase service account key (JSON format)
- `PORT` - Port to run the server on (default: 8080 for Heroku)

## Local Development

1. Install dependencies: `npm install`
2. Create a `.env` file with your configuration
3. Start the server: `npm start` or `npm run dev` for development

## Database Management

- `npm run migrate` - Run database migrations
- `npm run seed` - Seed all initial data
- `npm run seed-users` - Seed users only
- `npm run seed-elections` - Seed elections only

## Testing

- `npm run test-firebase` - Test Firebase connection
- `npm run test-api` - Test API connection
- `npm run test-connection` - Comprehensive frontend-backend connection test

For a complete list of commands, see `../COMMANDS_REFERENCE.md`