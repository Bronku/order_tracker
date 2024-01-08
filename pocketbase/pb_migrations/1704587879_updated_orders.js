/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("u6o0rgqp4evmeze")

  // remove
  collection.schema.removeField("lawgxtxv")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0khzo5zm",
    "name": "date",
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
  const collection = dao.findCollectionByNameOrId("u6o0rgqp4evmeze")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lawgxtxv",
    "name": "date",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  // remove
  collection.schema.removeField("0khzo5zm")

  return dao.saveCollection(collection)
})
