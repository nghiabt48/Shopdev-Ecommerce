const redisPubsubService = require("../services/redisPubsub.service");

class InventoryServiceTest {
  constructor() {
    redisPubsubService.subscribe('purchase_event', (channel, message) => {
      InventoryServiceTest.updateInventory(message)
    })
  }
  static updateInventory(message) {
    const objMessage = JSON.parse(message)
    console.log(`Update inventory ${objMessage.productId} with quantity ${objMessage.quantity}`)
  }

}
module.exports = new InventoryServiceTest();