# bossid-wasteiq-compare
Compare BossID to WasteIQ on data and calculations


## Run

NB: ATW we the key and audience must match with wasteIQ

```MAIN_SECRET_KEY=THE_SECRET_KEY_TO_WASTE_IQ MAIN_AUDIENCE=waste-iq port=3123 GRAPHQL_URL=url_to_graphQL node index --webpack```

Default GraphQL url: http://127.0.0.1:3000/publicgraphql

Except that on Windows, envs must be set with SET.   Except that you can use `.env` files.