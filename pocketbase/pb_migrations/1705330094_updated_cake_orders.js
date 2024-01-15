/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("smyhrr2ekc0edm4")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "pb4mok1h",
    "name": "field",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "891rzgl1jyfk55e",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("smyhrr2ekc0edm4")

  // remove
  collection.schema.removeField("pb4mok1h")

  return dao.saveCollection(collection)
})
