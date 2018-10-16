import ipfsAPI from "ipfs-api";
import { provider } from "../config/params.js";

const ipfs = ipfsAPI(provider.ipfs.host, provider.ipfs.port, {
  protocol: provider.ipfs.protocol
});

const IpfsStore = {
  add: function(data) {
    return new Promise((resolve, reject) => {
      ipfs.files.add(data, function(err, files) {
        if (err) reject(err);
        else resolve(files[0].hash);
      });
    });
  },
  pin: function(hash) {
    return new Promise((resolve, reject) => {
      ipfs.pin.add(hash, function(err) {
        if (err) reject(err);
      });
    });
  },
  get: function(hash) {
    const path = "/ipfs/" + hash;
    return new Promise((resolve, reject) => {
      ipfs.files.get(path, function(err, files) {
        if (err) reject(err);
        else resolve(files[0].content);
      });
    });
  }
};

export default IpfsStore;
