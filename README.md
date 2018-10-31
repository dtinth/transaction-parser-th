# transaction-parser-th

A JS library that can be used to parse transaction information from SMS
messages.

Right now, it supports SMS messages from TrueMoney Wallet and KBANK. Please
check out the [test cases](./test/sms_testcase.csv) for supported SMS patterns.

**Please help contribute more [patterns](./src/index.ts) to make this library
more complete!**

Example usage: You can set up
[IFTTT Android SMS](https://ifttt.com/services/android_messages) service that
sends SMS to a web service to automatically track your transactions.

## Synopsis

```js
const { parseSMS } = require('transaction-parser-th')

parseSMS(
  '23/06/18 15:20 A/C X555555X Withdrawal195.00 Outstanding Balance4695.81 Baht.',
  'KBank'
)
// => { provider: 'KBANK',
//      type: 'withdraw',
//      date: '2018-06-23',
//      time: '15:20',
//      from: 'A/C X555555X',
//      amount: '195.00',
//      balance: '4695.81' }

parseSMS(
  'ชำระ 90.00บ บัตร x-2866@TOPS CHIDLOM (CENTRAL) 14:39น เหลือ 1,337.55บ'
)
// => { provider: 'KBANK',
//      type: 'pay',
//      amount: '90.00',
//      from: 'x-2866',
//      to: 'TOPS CHIDLOM (CENTRAL)',
//      time: '14:39',
//      balance: '1337.55' }
```

## API

### parseSMS(text: string, sender?: string)

Parses SMS information.
