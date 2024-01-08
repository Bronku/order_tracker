/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("smyhrr2ekc0edm4")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ww2fgjkm",
    "name": "status",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("smyhrr2ekc0edm4")

  // remove
  collection.schema.removeField("ww2fgjkm")

  return dao.saveCollection(collection)
})
