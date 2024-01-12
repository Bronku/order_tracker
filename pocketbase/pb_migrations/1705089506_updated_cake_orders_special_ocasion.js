/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("891rzgl1jyfk55e")

  collection.name = "special_orders"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("891rzgl1jyfk55e")

  collection.name = "cake_orders_special_ocasion"

  return dao.saveCollection(collection)
})
