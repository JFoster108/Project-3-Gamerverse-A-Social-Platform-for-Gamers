describe("Create Profile", () => {
    it("should allow a user to create a profile", () => {
      cy.visit("/signup"); // or "/create-profile", depending on your route
  
      cy.get('input[name="username"]').type("testuser");
      cy.get('input[name="email"]').type("test@example.com");
      cy.get('input[name="password"]').type("password123");
      cy.get('button[type="submit"]').click();
  
      cy.contains("Welcome, testuser").should("exist"); // Adjust this text based on your success message
    });
  });
  