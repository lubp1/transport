describe('Testando compra de passagem', function() {
    it('Compra uma passagem para um cpf cadastrado', function() {
      cy.visit('localhost:3000')

      cy.get('[data-cy="email"]')
      .type('admin')
      .should('have.value', 'admin')

      cy.get('[data-cy="senha"]')
      .type('admin')
      .should('have.value', 'admin')

      cy.get('[data-cy="login"]').click()

      cy.url().should('include', '/passagemBalcao')

      cy.get('[data-cy="partida"]').select('São Paulo')
      cy.get('[data-cy="destino"]').select('Rio de Janeiro')

      cy.get('[data-cy="procurarHorario"]').click()

      cy.get('[data-cy="horario"]').select('11/12 12h')

      cy.get('[data-cy="procurarAssento"]').click()

      cy.get('[data-cy="assento"]').select('3')

      cy.get('[data-cy="escolherAssento"]').click()
      
      cy.get('[data-cy="cpf"]').type('345.345.345-34')

      cy.get('[data-cy="procurarCPF"]').click()

      cy.get('[data-cy="comprar"]').click()

      cy.on('window:alert', (str) => {
        expect(str).to.equal(`Passagem comprada com sucesso!`)
      })

    })
  })
  