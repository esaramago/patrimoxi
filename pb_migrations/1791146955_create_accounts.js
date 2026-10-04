/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    name: "accounts",
    type: "base",
    listRule: "@request.auth.id != ''",
    viewRule: "@request.auth.id != ''",
    createRule: "@request.auth.id != ''",
    updateRule: "@request.auth.id != ''",
    deleteRule: "@request.auth.id != ''",
    fields: [
      {
        name: "name",
        type: "text",
        required: true,
      },
      {
        name: "currency",
        type: "text",
        required: true,
      },
      {
        name: "active",
        type: "bool",
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
        collectionId: "_pb_users_auth_",
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
      "CREATE INDEX idx_accounts_user ON accounts (user)",
      "CREATE INDEX idx_accounts_active ON accounts (active)",
    ],
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("accounts");
  return app.delete(collection);
});
