/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("smyhrr2ekc0edm4")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cr1rjod1",
    "name": "cakes",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("smyhrr2ekc0edm4")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cr1rjod1",
    "name": "contents",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
})
