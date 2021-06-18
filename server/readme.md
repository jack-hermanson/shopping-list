# Server Side

### Starting the app

From the root directory of the entire app, run:

`yarn start`

Or, to just run the server, from the root directory enter:

```shell
cd server
yarn start
```

If nodemon complains, run:

`npx kill-port 5000`

### Environment variables

The `.env` file should look like this:

```dotenv
SECRET_KEY=#secret_key
DATABASE_DIALECT=sqlite
DATABASE_URL=sqlite:site.db
```

### Manual migrations

`cd` into the migrations directory, then run:

`typeorm migration:create -n MigrationName`
