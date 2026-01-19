describe('Bilibili subtitle converter', () => {
  it('pastes json and shows preview', () => {
    cy.visit('/toolbox/subtitle')
    const data = {
      body: [
        { from: 0.5, to: 2, content: '第一行' },
        { from: 2, to: 4, content: '第二行' }
      ]
    }
    cy.get('textarea').type(JSON.stringify(data), { parseSpecialCharSequences: false })
    cy.contains('已识别 2 行字幕')
    cy.contains('第一行')
  })
})
