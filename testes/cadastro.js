describe('Testando tela de cadastro', function() {
    it('Cadastra um usuario', function() {
      cy.visit('localhost:3000')

      cy.contains('Não sou cadastrado').click()

      cy.url().should('include', '/cadastro')

      cy.get('[placeholder=Nome]')
      .type('Marcos')
      .should('have.value', 'Marcos')

      cy.get('[placeholder=E-mail]')
      .type('marco@email.com')
      .should('have.value', 'marco@email.com')

      cy.get('[placeholder=CPF]')
      .type('123.456.789-39')
      .should('have.value', '123.456.789-39')

      cy.get('[placeholder=Senha]')
      .type('senha')
      .should('have.value', 'senha')

      cy.get('[placeholder="Confirmar Senha"]')
      .type('senha')
      .should('have.value', 'senha')

      cy.contains('Cadastrar').click()

      cy.on('window:alert', (str) => {
        expect(str).to.equal(`Cadastrado com sucesso!`)
      })
    })
  })
  