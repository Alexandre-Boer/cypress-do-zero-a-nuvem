describe("Central de Atendimento ao Cliente TAT", () => {
  beforeEach(() => {
    cy.visit("src/index.html")
  });

  it("verifica o título da aplicação", () => {
    cy.title().should("be.equal", "Central de Atendimento ao Cliente TAT")
  });

  it("preenche os campos obrigatórios e envia o formuário", () => {
    const longText = Cypress._.repeat("abcdefghijklmnopqrstuvwxyz", 10)

    cy.get("#firstName").type("Alexandre")
    cy.get("#lastName").type("Boer")
    cy.get("#email").type("teste.ale@gmail.com")
    cy.get("#open-text-area").type(longText, { delay: 0 })
    cy.contains("button", "Enviar").click()

    cy.get(".success").should("be.visible")
  });

  it("exibe mensagem de erro ao submeter o formulário com um email com formatação inválida", () => {
    cy.get("#firstName").type("Alexandre")
    cy.get("#lastName").type("Boer")
    cy.get("#email").type("teste.alegmail.com")
    cy.get("#open-text-area").type("Hello, it's me!")
    cy.contains("button", "Enviar").click()

    cy.get(".error").should("be.visible")
  });

  it("campo telefone continua vazio quando preenchido com valor não numérico", () => {
    cy.get("#phone").type("acbde").should("have.value", "")
  });

  it("exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário", () => {
    cy.get("#firstName").type("Alexandre")
    cy.get("#lastName").type("Boer")
    cy.get("#email").type("teste.alegmail.com")
    cy.get("#open-text-area").type("Hello, world!")
    cy.get("#phone-checkbox").check()
    cy.contains("button", "Enviar").click()

    cy.get(".error").should("be.visible")
  });

  it("preenche e limpa os campos nome, sobrenome, email e telefone", () => {
    cy.get("#firstName")
      .type("Alexandre")
      .should("have.value", "Alexandre")
      .clear()
      .should("have.value", "")
    cy.get("#lastName")
      .type("Boer")
      .should("have.value", "Boer")
      .clear()
      .should("have.value", "")
    cy.get("#email")
      .type("test_ale@gmail.com")
      .should("have.value", "test_ale@gmail.com")
      .clear()
      .should("have.value", "")
    cy.get("#phone")
      .type("123456789")
      .should("have.value", "123456789")
      .clear()
      .should("have.value", "")
  });

  it("exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios", () => {
    cy.contains("button", "Enviar").click()

    cy.get(".error").should("be.visible")
  });

  it("envia o formuário com sucesso usando um comando customizado", () => {
    const data = {
      firstName: "Alexandre",
      lastName: "Boer",
      email: "test.ale@gmail.com",
      text: "Hello, world!",
    }

    cy.fillMandatoryFieldsAndSubmit(data)

    cy.get(".success").should("be.visible")
  });

  it("seleciona um produto (Youtube) por seu texto", () => {
    cy.get("#product").select("YouTube").should("have.value", "youtube")
  });

  it("seleciona um produto (Mentoria) por seu valor (value)", () => {
    cy.get("#product").select("mentoria").should("have.value", "mentoria")
  });

  it("seleciona um produto (Blog) por seu índice", () => {
    cy.get("#product").select(1).should("have.value", "blog")
  });

  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"][value="feedback"]').check().should("be.checked")
  });

  it('marca cada tipo de atendimento', () => {
    cy.get('input[type="radio"]')
      .each((typeOfService) => {
        cy.wrap(typeOfService)
          .check()
          .should('be.checked')
    });
  });

  it('marca ambos checkboxes, depois desmarca o último', () => {
    cy.get('input[type="checkbox"]')
      .each((typeOfContact) => {
        cy.wrap(typeOfContact)
          .check()
          .should('be.checked')
      })
      .last()
      .uncheck()
      .should('not.be.checked')
  });

  it('seleciona um arquivo da pasta fixtures', () => {
    cy.get('#file-upload')
      .selectFile('cypress/fixtures/example.json')
      .should((input) => {
        expect(input[0].files[0].name).to.equal('example.json')
      })
  });

  it('seleciona um arquivo simulando drag-and-adrop', () => {
    cy.get('#file-upload')
      .selectFile('cypress/fixtures/example.json', { action: 'drag-drop' })
      .should((input) => {
        expect(input[0].files[0].name).to.equal('example.json')
      })
  });

  it('seleciona um arquivo utilizando uma fixture para qual foi dada um alias', () => {
    cy.fixture('example.json').as('sampleFile')
    cy.get('#file-upload')
      .selectFile('@sampleFile')
      .should((input) => {
        expect(input[0].files[0].name).to.equal('example.json')
      })
  });

  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
    cy.contains('a', 'Política de Privacidade')
      .should('have.attr', 'href', 'privacy.html')
      .and('have.attr', 'target', '_blank')
  });

  it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
    cy.contains('a', 'Política de Privacidade')
      .invoke('removeAttr', 'target')
      .click()

    cy.contains('h1', 'CAC TAT - Política de Privacidade').should('be.visible')
  });

  it('exibe e oculta as mensagens de sucesso e erro usando .invoke()', () => {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  });

  it('preenche o campo da área de texto usando o comando invoke', () => {
    cy.get('#open-text-area').invoke('val', 'um texto qualquer')
      .should('have.value', 'um texto qualquer')
  });

  it('faz uma requisição HTTP', () => {
    cy.request('https://cac-tat-v3.s3.eu-central-1.amazonaws.com/index.html')
      .as('getRequest')
      .its('status')
      .should('be.equal', 200)
    cy.get('@getRequest')
      .its('statusText')
      .should('be.equal', 'OK')
    cy.get('@getRequest')
      .its('body')
      .should('include', 'CAC TAT')
  });

  it('encontra o gato escondido', () => {
    cy.get('#cat')
      .invoke('show')
      .should('be.visible')
    cy.get('#title')
      .invoke('text', 'CAT TAT')
    cy.get('#subtitle')
      .invoke('text', 'Eu 🩷 gatos!')
  });
});
