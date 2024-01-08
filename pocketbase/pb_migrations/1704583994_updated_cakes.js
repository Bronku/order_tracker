/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3rgdadocx5qj2sr")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "pvmnkkl0",
    "name": "hidden",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3rgdadocx5qj2sr")

  // remove
  collection.schema.removeField("pvmnkkl0")

  return dao.saveCollection(collection)
})
