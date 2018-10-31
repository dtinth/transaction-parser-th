import { PatternMatcher, compilePattern } from './PatternMatcher'

const smsMatcherProviders: { [provider: string]: SMSMatcher[] } = {
  'TrueMoney Wallet': [
    // == TrueMoney ==
    match(
      'TrueMoney',
      'ชำระเงิน {{amount:number}}บ. ให้ {{to}} คงเหลือ {{balance:number}}บ. ({{transactionId}})',
      { type: 'pay' }
    ),
    match(
      'TrueMoney',
      'You have paid {{amount:number}} Baht using {{via}}. Your balance is {{balance:number}} Baht (transaction {{transactionId}})',
      { type: 'pay' }
    )
  ],

  KBANK: [
    match(
      'KBank',
      '{{date:kbank_date}} {{time:time}} {{from}} transferred {{amount:number}} Baht to {{to}} Outstanding Balance {{balance:number}} Baht.',
      { type: 'transfer' }
    ),
    match(
      'KBank',
      '{{date:kbank_date}} {{time:time}} {{from}} transferred {{amount:number}} Baht to {{to}}',
      { type: 'transfer' }
    ),
    match(
      'KBank',
      '{{date:kbank_date}} {{time:time}} {{from}} Withdrawal{{amount:number}} Outstanding Balance{{balance:number}} Baht.',
      { type: 'withdraw' }
    ),
    match(
      'KBank',
      '{{date:kbank_date}} {{time:time}} {{from}} Withdrawal{{amount:number}} Baht.',
      { type: 'withdraw' }
    ),
    match(
      'KBank',
      '{{date:kbank_date}} {{time:time}} {{to}} Deposit{{amount:number}} Outstanding Balance{{balance:number}} Baht.',
      { type: 'deposit' }
    ),
    match(
      'KBank',
      '{{date:kbank_date}} {{time:time}} {{to}} Deposit{{amount:number}} Baht.',
      { type: 'deposit' }
    ),
    match(
      'KBank',
      '{{date:kbank_date}} {{time:time}} {{from}} credited {{amount:number}} Baht to {{to}} Outstanding Balance {{balance:number}} Baht.',
      { type: 'credit' }
    ),
    match(
      'KBank',
      '{{date:kbank_date}} {{time:time}} {{from}} credited {{amount:number}} Baht to {{to}}',
      { type: 'credit' }
    ),
    match(
      'KBank',
      '{{date:kbank_date}} {{time:time}} {{to}} received {{amount:number}} Baht from {{from}} Outstanding Balance {{balance:number}} Baht.',
      { type: 'receive' }
    ),
    match(
      'KBank',
      '{{date:kbank_date}} {{time:time}} {{to}} received {{amount:number}} Baht from {{from}}',
      { type: 'receive' }
    ),
    match(
      'KBank',
      '{{date:kbank_date}} {{time:time}} {{subject}} Outstanding Balance {{balance:number}} Baht.',
      { type: 'info' }
    ),
    match(
      'KBank',
      'ชำระ {{amount:number}}บ บัตร {{from}}@{{to}} {{time:time}}น เหลือ {{balance:number}}บ',
      { type: 'pay' }
    ),
    match(
      'KBank',
      'คืนเงิน {{amount:number}}บ บัตร {{to}}@{{from}} {{time:time}}น เหลือ {{balance:number}}บ',
      { type: 'refund' }
    )
  ]
}
export function parseSMS(text: string, sender?: string) {
  for (const provider of Object.keys(smsMatcherProviders)) {
    for (const smsMatcher of smsMatcherProviders[provider]) {
      if (sender && sender !== smsMatcher.from) {
        continue
      }
      const result = smsMatcher.patternMatcher.execute(text)
      if (!result) {
        continue
      }
      return {
        provider,
        ...smsMatcher.extra,
        ...result
      }
    }
  }
  return null
}
type SMSMatcher = {
  from: string
  patternMatcher: PatternMatcher
  extra: any
}
function match(from: string, pattern: string, extra: any): SMSMatcher {
  return {
    from,
    patternMatcher: compilePattern(pattern),
    extra
  }
}
