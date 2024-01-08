/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("k9jnn7oln1wdkyw");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "k9jnn7oln1wdkyw",
    "created": "2024-01-04 08:04:17.150Z",
    "updated": "2024-01-04 08:54:26.618Z",
    "name": "test",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "beomkudp",
        "name": "text",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "rsxjfp22",
        "name": "number",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      },
      {
        "system": false,
        "id": "luhm8srn",
        "name": "contents",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 2000000
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
