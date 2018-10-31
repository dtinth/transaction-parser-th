const fs = require('fs')
const input = fs.readFileSync(__dirname + '/sms_testcase.csv', 'utf8')
const parse = require('csv-parse/lib/sync')
const records = parse(input, {
  columns: true,
  skip_empty_lines: true
})
const { parseSMS } = require('../lib')
for (const record of records) {
  it(record['input text'], () => {
    const result = parseSMS(record['input text'], record['input from'])
    const expected = {}
    for (const key of Object.keys(record)) {
      const [α, β] = key.split(' ')
      if (α === 'output' && record[key]) {
        expected[β] = record[key]
      }
    }
    expect(result).toEqual(expected)
  })
}
