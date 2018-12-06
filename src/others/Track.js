import instruments from './instruments'

export default class Track {
  constructor (bmsb, blsb, program, channel) {
    this.bankSelectMSB = bmsb
    this.bankSelectLSB = blsb
    this.emulateBankSelectMSB = bmsb
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
    this.emulateBankSelectMSB = this.generateEmulatedBankSelectMSB()
  }
  generateEmulatedBankSelectMSB () {
    if (this.isDrum) {
      return 0
    }
    const name = this.getRealName()
    return !name ? 0 : this.bankSelectMSB
  }
  getEmulatedName () {
    if (this.isDrum) {
      return instruments[this.programChangeNumber + 1]['drum']
    }
    return instruments[this.programChangeNumber + 1][this.generateEmulatedBankSelectMSB()]
  }
  getRealName () {
    const bmsb = this.bankSelectMSB
    const program = this.programChangeNumber
    if (this.isDrum) {
      return instruments[program + 1]['drum']
    }
    return instruments[program + 1][bmsb]
  }
  setBankSelectLSB (param) {
    this.bankSelectLSB = param
    this.emulateBankSelectMSB = this.generateEmulatedBankSelectMSB()
  }
  setProgramChange (param) {
    this.programChangeNumber = param
    this.emulateBankSelectMSB = this.generateEmulatedBankSelectMSB()
  }
  setIsDrum (param) {
    this.isDrum = param
  }
  toString () {
    return `BankSelect MSB: ${this.bankSelectMSB}, BankSelect MSB[EMULATE]: ${this.emulateBankSelectMSB}, BankSelect LSB: ${this.bankSelectLSB}, ProgramNo: ${this.programChangeNumber}, isDrum?: ${this.isDrum}, RealName: ${this.getRealName()}, EmulatedName: ${this.getEmulatedName()}`
  }
  static makePart ({ bankMSB, bankLSB, programNumber, channel }) {
    return new Track(bankMSB, bankLSB, programNumber, channel)
  }
}
