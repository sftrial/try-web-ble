(function() {
  'use strict';

  let encoder = new TextEncoder('utf-8');
  let decoder = new TextDecoder('utf-8');

  const TARGET_NAME = 'LightingMesh';
  const NUS_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
  const NUS_TX_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
  const NUS_RX_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

  const GAP_SERVICE_UUID = 0x1800;
  const DEVICE_NAME_UUID = 0x2A00;

  class Playbulb {
    constructor() {
      this.device = null;
      this._isEffectSet = false;
    }
    
    connect() {
      console.log('to connect to ' + TARGET_NAME);
      let options = {filters:[{name: [ TARGET_NAME ]}],
                     optionalServices: [ NUS_SERVICE_UUID, GAP_SERVICE_UUID ]};
      return navigator.bluetooth.requestDevice(options)
      .then(device => {
        device.addEventListener('gattserverdisconnected', onDisconnected);
        this.device = device;
        return device.gatt.connect();
      });
    }
    getDeviceName() {
      return this.device.gatt.getPrimaryService(GAP_SERVICE_UUID)
      .then(service => service.getCharacteristic(DEVICE_NAME_UUID))
      .then(characteristic => characteristic.readValue())
      .then(data => {
        let decoder = new TextDecoder('utf-8');
        return decoder.decode(data);
      });
    }
    setColor(id, r, g, b) {
      return Promise.resolve()
      .then(() => {
        let data = new Uint8Array([0x00, id, 0x03, 0x01, r, g, b]);
        return this.device.gatt.getPrimaryService(NUS_SERVICE_UUID)
        .then(service => service.getCharacteristic(NUS_TX_UUID))
        .then(characteristic => characteristic.writeValue(data))
        .then(() => [r,g,b]);
      });
    }
  }
  
  window.playbulb = new Playbulb();      

})();
