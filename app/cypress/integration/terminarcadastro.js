describe('Testando compra de passagem', function() {
    it('Compra uma passagem para um cpf não cadastrado', function() {
      cy.visit('localhost:3000')

      cy.contains('Não sou cadastrado').click()

      cy.url().should('include', '/cadastro')

      cy.get('[data-cy="nome"]')
      .type('João Pereira')
      .should('have.value', 'João Pereira')

      cy.get('[data-cy="email"]')
      .type('joao@email.com')
      .should('have.value', 'joao@email.com')

      cy.get('[data-cy="cpf"]')
      .type('345.345.345-00')
      .should('have.value', '345.345.345-00')

      cy.get('[data-cy="senha"]')
      .type('1234')
      .should('have.value', '1234')

      cy.get('[data-cy="confirmasenha"]')
      .type('1234')
      .should('have.value', '1234')

      cy.get('[data-cy="cadastro"]').click()

      cy.wait(100)

      cy.get('[data-cy="email"]')
      .type('joao@email.com')
      .should('have.value', 'joao@email.com')

      cy.get('[data-cy="senha"]')
      .type('1234')
      .should('have.value', '1234')

      cy.get('[data-cy="login"]').click()

      cy.url().should('include', '/inicio')

    

    })
  })
  