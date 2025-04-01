Cypress.Commands.add("login", () => {
    cy.request("POST", "http://localhost:5000/graphql", {
      query: `
        mutation {
          login(email: "test@example.com", password: "password123")
        }
      `,
    }).then((res) => {
      const token = res.body.data.login;
      cy.setCookie("token", token);
    });
  });
  