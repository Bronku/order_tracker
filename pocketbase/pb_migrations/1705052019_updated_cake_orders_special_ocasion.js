/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("891rzgl1jyfk55e")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "exfxdums",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ydp5m0wj",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lqjztlvc",
    "name": "order_contents",
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
  const collection = dao.findCollectionByNameOrId("891rzgl1jyfk55e")

  // remove
  collection.schema.removeField("exfxdums")

  // remove
  collection.schema.removeField("ydp5m0wj")

  // remove
  collection.schema.removeField("lqjztlvc")

  return dao.saveCollection(collection)
})
