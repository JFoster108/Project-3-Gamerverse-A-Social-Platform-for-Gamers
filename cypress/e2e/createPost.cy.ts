describe("Create Post", () => {
    beforeEach(() => {
      cy.login(); // Custom command to log in — I’ll show you how to create this below
    });
  
    it("should allow a user to create a post", () => {
      cy.visit("/create-post");
  
      cy.get('textarea[name="text"]').type("This is a test post.");
      cy.get('input[type="file"]').selectFile("cypress/fixtures/sample.png", { force: true });
      cy.get('button[type="submit"]').click();
  
      cy.contains("This is a test post.").should("exist");
    });
  });
  