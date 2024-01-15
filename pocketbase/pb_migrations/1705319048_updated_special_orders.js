/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("891rzgl1jyfk55e")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qw7nvzzo",
    "name": "field",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "smyhrr2ekc0edm4",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("891rzgl1jyfk55e")

  // remove
  collection.schema.removeField("qw7nvzzo")

  return dao.saveCollection(collection)
})
