describe('Testando tela de cadastro', function() {
    it('Tenta cadastrar um email que existe', function() {
      cy.visit('localhost:3000')

      cy.contains('Não sou cadastrado').click()

      cy.url().should('include', '/cadastro')

      cy.get('[data-cy="nome"]')
      .type('Marcos')
      .should('have.value', 'Marcos')

      cy.get('[data-cy="email"]')
      .type('email')
      .should('have.value', 'email')

      cy.get('[data-cy="cpf"]')
      .type('123.456.789-39')
      .should('have.value', '123.456.789-39')

      cy.get('[data-cy="senha"]')
      .type('senha')
      .should('have.value', 'senha')

      cy.get('[data-cy="confirmasenha"]')
      .type('senha')
      .should('have.value', 'senha')

      cy.get('[data-cy="cadastro"]').click()

      cy.on('window:alert', (str) => {
        expect(str).to.equal(`Erro no cadastro!`)
      })
    })
  })
  