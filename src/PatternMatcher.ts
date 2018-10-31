import escapeStringRegexp from 'escape-string-regexp'

export type PatternMatcher = {
  execute(text: string): { [k: string]: string } | null
}

export function compilePattern(pattern: string): PatternMatcher {
  const regexpParts: string[] = []
  const matchParts: { key: string; matcher: PlaceholderMatcher }[] = []
  pattern.split(/\{\{(\w+(?::\w+)?)\}\}/).forEach((part, i) => {
    if (i % 2 === 0) {
      regexpParts.push(
        part
          .split(/\s+/)
          .map(x => escapeStringRegexp(x))
          .join(`\\s*`)
      )
    } else {
      const subparts = part.split(':')
      const key = subparts[0]
      const matcherName = subparts[1] || 'string'
      const matcher = placeholderMatchers[matcherName]
      regexpParts.push(`(${matcher.regexp})`)
      matchParts.push({ key, matcher })
    }
  })
  const regexp = new RegExp(`^\\s*${regexpParts.join('')}\\s*$`, 'i')
  return {
    execute: text => {
      const match = regexp.exec(text)
      if (!match) return null
      const output: { [k: string]: string } = {}
      matchParts.forEach((part, i) => {
        output[part.key] = part.matcher.process(match[i + 1])
      })
      return output
    }
  }
}

const placeholderMatchers: { [k: string]: PlaceholderMatcher } = {
  string: {
    regexp: `.+?`,
    process: matchedText => matchedText
  },
  number: {
    regexp: `[0-9,.-]+`,
    process: matchedText => parseFloat(matchedText.replace(/,/g, '')).toFixed(2)
  },
  kbank_date: {
    regexp: `\\d\\d\\/\\d\\d\\/\\d\\d`,
    process: matchedText => {
      const [a, b, c] = matchedText.split('/')
      return `20${c}-${b}-${a}`
    }
  },
  time: {
    regexp: `\\d\\d?:\\d\\d`,
    process: matchedText => (matchedText.length < 5 ? '0' : '') + matchedText
  }
}

type PlaceholderMatcher = {
  regexp: string
  process: (matchedText: string) => string
}
