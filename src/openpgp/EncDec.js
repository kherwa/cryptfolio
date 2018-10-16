import openpgp, { message } from "openpgp";

const EncDec = {
  encrypt: function(jsonStr, password) {
    let options = {
      message: message.fromText(jsonStr),
      passwords: [password],
      armor: false
    };
    return openpgp
      .encrypt(options)
      .then(ciphertext => new Buffer(ciphertext.message.packets.write()));
  },

  decrypt: async function(ciphertext, password) {
    let options = {
      message: await message.read(ciphertext),
      passwords: [password]
    };
    return openpgp.decrypt(options).then(plaintext => plaintext.data);
  }
};

export default EncDec;
