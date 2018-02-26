(function() {
  'use strict';

  let encoder = new TextEncoder('utf-8');
  let decoder = new TextDecoder('utf-8');

  const NUS_SERVICE_UUID = '6E400001B5A3F393E0A9E50E24DCCA9E';
  const NUS_TX_UUID = '6E400002B5A3F393E0A9E50E24DCCA9E';
  const NUS_RX_UUID = '6E400003B5A3F393E0A9E50E24DCCA9E';

  const GAP_SERVICE_UUID = 0x1800;
  const DEVICE_NAME_UUID = 0x2A00;

  class Playbulb {
    constructor() {
      this.device = null;
      this._isEffectSet = false;
    }
    connect() {
      let options = {filters:[{services:[ NUS_SERVICE_UUID ]}],
                     optionalServices: ['battery_service']};
      return navigator.bluetooth.requestDevice(options)
      .then(device => {
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
    setColor(r, g, b) {
      return Promise.resolve()
      .then(() => {
        let data = new Uint8Array([0x00, 0x00, 0x03, 0x01, r, g, b]);
        return this.device.gatt.getPrimaryService(NUS_SERVICE_UUID)
        .then(service => service.getCharacteristic(NUS_TX_UUID))
        .then(characteristic => characteristic.writeValue(data))
        .then(() => [r,g,b]);
      });
    }

  window.playbulb = new Playbulb();

})();
