describe("Home Page", () => {
    it("loads successfully and renders content", () => {
      cy.visit("/");
  
      // Adjust this based on your actual homepage text or elements
      cy.contains("Gamerverse").should("exist");
    });
  });
  