/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const accountsCollection = app.findCollectionByNameOrId("accounts");
  const usersCollection = app.findCollectionByNameOrId("_pb_users_auth_");

  const collection = new Collection({
    name: "transactions",
    type: "base",
    listRule: "@request.auth.id != ''",
    viewRule: "@request.auth.id != ''",
    createRule: "@request.auth.id != ''",
    updateRule: "@request.auth.id != ''",
    deleteRule: "@request.auth.id != ''",
    fields: [
      {
        name: "account",
        type: "relation",
        collectionId: accountsCollection.id,
        cascadeDelete: true,
        maxSelect: 1,
        required: true,
      },
      {
        name: "type",
        type: "select",
        values: [
          "deposit",
          "withdrawal",
          "buy",
          "sell",
          "dividend",
          "interest",
          "fee",
          "transfer"
        ],
        maxSelect: 1,
        required: true,
      },
      {
        name: "date",
        type: "date",
        required: true,
      },
      {
        name: "amount",
        type: "number",
        required: true,
      },
      {
        name: "currency",
        type: "text",
        required: false,
      },
      {
        name: "asset",
        type: "text",
        required: false,
      },
      {
        name: "quantity",
        type: "number",
        required: false,
      },
      {
        name: "unit_price",
        type: "number",
        required: false,
      },
      {
        name: "fee",
        type: "number",
        required: false,
      },
      {
        name: "tax",
        type: "number",
        required: false,
      },
      {
        name: "exchange_rate",
        type: "number",
        required: false,
      },
      {
        name: "notes",
        type: "text",
        required: false,
      },
      {
        name: "user",
        type: "relation",
        collectionId: usersCollection.id,
        cascadeDelete: true,
        maxSelect: 1,
        required: false,
      },
      {
        name: "created",
        type: "autodate",
        onCreate: true,
        onUpdate: false,
      },
      {
        name: "updated",
        type: "autodate",
        onCreate: true,
        onUpdate: true,
      },
    ],
    indexes: [
      "CREATE INDEX idx_transactions_account ON transactions (account)",
      "CREATE INDEX idx_transactions_user ON transactions (user)",
      "CREATE INDEX idx_transactions_date ON transactions (date)",
      "CREATE INDEX idx_transactions_type ON transactions (type)",
    ],
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("transactions");
  return app.delete(collection);
});
