describe('sandbox', () => {
  let sampleString: string

  beforeEach(() => {
    sampleString = 'string for test'
  })

  test('sample test', async () => {
    expect(sampleString).toBe('string for test')
  })
})

export {}
