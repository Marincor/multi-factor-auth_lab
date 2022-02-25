export function makeBase32(length: any) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() *
charactersLength));
 }
 return result.toUpperCase();
}

export const { v4: uuidv4 } = require('uuid');
