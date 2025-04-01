describe("Search Games", () => {
    beforeEach(() => {
      cy.login();
    });
  
    it("should search for a game and add it to library", () => {
      cy.visit("/search");
  
      cy.get('input[name="search"]').type("Zelda{enter}");
  
      cy.contains("The Legend of Zelda").should("exist"); // or a real result from your backend
      cy.contains("Add to Library").click();
  
      cy.visit("/my-library");
      cy.contains("The Legend of Zelda").should("exist");
    });
  });
  