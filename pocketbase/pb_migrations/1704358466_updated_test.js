/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("k9jnn7oln1wdkyw")

  // add
  collection.schema.addField(new SchemaField({
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
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("k9jnn7oln1wdkyw")

  // remove
  collection.schema.removeField("luhm8srn")

  return dao.saveCollection(collection)
})
