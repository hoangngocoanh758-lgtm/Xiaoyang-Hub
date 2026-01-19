import { parseJson, buildPreview } from '@/services/subtitleService'

describe('subtitleService', () => {
  it('parses valid body array', () => {
    const json = JSON.stringify([{ from: 0.5, to: 2, content: 'hello' }])
    const subs = parseJson(json)
    expect(subs.length).toBe(1)
    expect(subs[0].content).toBe('hello')
  })

  it('throws on invalid json', () => {
    expect(() => parseJson('not json')).toThrow()
  })

  it('builds preview text', () => {
    const subs = [
      { from: 0, to: 1, content: 'line1' },
      { from: 1, to: 2, content: 'line2' }
    ]
    const text = buildPreview(subs, 'txt', 0)
    expect(text).toContain('line1')
    expect(text).toContain('line2')
  })
})
