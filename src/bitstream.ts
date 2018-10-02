import { BigNumber } from "bignumber.js";
import abi = require("ethereumjs-abi");

export class Bitstream {
  private data: string;

  constructor(private initialData: string = "") {
    this.data = initialData;
    if (this.data.startsWith("0x")) {
      this.data = this.data.slice(2);
    }
  }

  public getData() {
    if (this.data.length === 0) {
      return "0x0";
    } else {
      return "0x" + this.data;
    }
  }

  public getBytes32Array() {
    if (this.data.length === 0) {
      return [];
    } else {
      assert.equal(this.length() % 32, 0, "Bitstream not compatible with bytes32[]");
      return this.data.match(/.{1,64}/g).map((element) => "0x" + element);
    }
  }

  public addBigNumber(x: BigNumber, numBytes = 32, forceAppend = true) {
    const formattedData = this.padString(web3.toHex(x).slice(2), numBytes * 2);
    return this.insert(formattedData, forceAppend);
  }

  public addNumber(x: number, numBytes = 4, forceAppend = true) {
    // Check if we need to encode this number as negative
    if (x < 0) {
        const encoded = abi.rawEncode(["int256"], [x.toString(10)]);
        const hex = encoded.toString("hex").slice(-(numBytes * 2));
        return this.addHex(hex, forceAppend);
    } else {
      return this.addBigNumber(new BigNumber(x), numBytes, forceAppend);
    }
  }

  public addAddress(x: string, numBytes = 20, forceAppend = true) {
    const formattedData = this.padString(x.slice(2), numBytes * 2);
    return this.insert(formattedData, forceAppend);
  }

  public addHex(x: string, forceAppend = true) {
    if (x.startsWith("0x")) {
      return this.insert(x.slice(2), forceAppend);
    } else {
      return this.insert(x, forceAppend);
    }
  }

  public addRawBytes(bs: string, forceAppend = true) {
    const bsHex = web3.toHex(bs);
    // console.log("bsHex:", bsHex);
    return this.insert(bsHex.slice(2), forceAppend);
  }

  public extractUint8(offset: number) {
    return parseInt(this.extractBytes1(offset).toString("hex"), 16);
  }

  public extractUint16(offset: number) {
    return parseInt(this.extractBytesX(offset, 2).toString("hex"), 16);
  }

  public extractUint32(offset: number) {
    return parseInt(this.extractBytesX(offset, 4).toString("hex"), 16);
  }

  public extractUint(offset: number) {
    return new BigNumber(this.extractBytesX(offset, 32).toString("hex"), 16);
  }

  public extractAddress(offset: number) {
    return "0x" + this.extractBytesX(offset, 20).toString("hex");
  }

  public extractBytes1(offset: number) {
    return this.extractBytesX(offset, 1);
  }

  public extractBytes32(offset: number) {
    return this.extractBytesX(offset, 32);
  }

  public extractBytesX(offset: number, length: number) {
    const start = offset * 2;
    const end = start + length * 2;

    if (this.data.length < end) {
      throw new Error("substring index out of range:[" + start + ", " + end + "]");
    }

    return new Buffer(this.data.substring(start, end), "hex");
  }

  // Returns the number of bytes of data
  public length() {
    return this.data.length / 2;
  }

  private insert(x: string, forceAppend: boolean) {
    const offset = this.length();
    if (!forceAppend) {
      let start = 0;
      while (start !== -1) {
        start = this.data.indexOf(x, start);
        if (start !== -1) {
          if ((start % 2) === 0) {
            console.log("++ Reused " + x + " at location " + start / 2);
            return start / 2;
          } else {
            start++;
          }
        }
      }
    }
    this.data += x;
    return offset;
  }

  private padString(x: string, targetLength: number) {
    if (x.length > targetLength) {
      throw Error("0x" + x + " is too big to fit in the requested length (" + targetLength + ")");
    }
    while (x.length < targetLength) {
      x = "0" + x;
    }
    return x;
  }

}
