export default class Track {
  constructor (bmsb, blsb, program, channel) {
    this.bankSelectMSB = bmsb
    this.bankSelectLSB = blsb
    this.programChangeNumber = program
    this.isDrum = channel === 10
    this.channel = channel
  }
  reset () {
    this.bankSelectMSB = 0
    this.bankSelectLSB = 0
    this.programChangeNumber = 0
    this.isDrum = this.channel === 10
  }
  setBankSelectMSB (param) {
    this.bankSelectMSB = param
  }
  setBankSelectLSB (param) {
    this.bankSelectLSB = param
  }
  setProgramChange (param) {
    this.programChangeNumber = param
  }
  setIsDrum (param) {
    this.isDrum = param
  }
  toString () {
    return `BankSelect MSB: ${this.bankSelectMSB}, BankSelect LSB: ${this.bankSelectLSB}, ProgramNo: ${this.programChangeNumber}, isDrum?: ${this.isDrum()}`
  }
  static makePart ({ bankMSB, bankLSB, programNumber, channel }) {
    return new Track(bankMSB, bankLSB, programNumber, channel)
  }
}
