// ---------------------------------------------------------------------------
// Auth E2E tests – uses real backend (H2, starts with only Admin/Admin)
// ---------------------------------------------------------------------------

describe("Login page", () => {
  beforeEach(() => {
    cy.clearAllLocalStorage();
    cy.visit("/login");
  });

  it("displays login heading", () => {
    cy.get("h1").should("contain.text", "Anmelden");
  });

  it("renders username and password inputs", () => {
    cy.get('input[type="text"]').should("exist");
    cy.get('input[type="password"]').should("exist");
  });

  it("shows error on invalid credentials", () => {
    cy.get('input[type="text"]').type("wronguser");
    cy.get('input[type="password"]').type("wrongpass");
    cy.get('button[type="submit"]').click();
    cy.contains("Ungültige Anmeldedaten.").should("be.visible");
  });

  it("redirects to /admin on successful login as admin", () => {
    cy.get('input[type="text"]').type("Admin");
    cy.get('input[type="password"]').type("Admin");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/admin");
  });

  it("redirects to /profile on successful login as regular user", () => {
    // create a regular user, then log in via UI
    cy.loginAsAdmin();
    let userId: number;
    cy.createTestUser("cy_login_user", "cy_login@test.com").then((r) => {
      userId = r.body.id;
    });
    cy.clearAllLocalStorage();
    cy.visit("/login");

    cy.get('input[type="text"]').type("cy_login_user");
    cy.get('input[type="password"]').type("Test1234");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/profile");

    // cleanup
    cy.then(() => {
      cy.loginAsAdmin();
      cy.deleteTestUser(userId);
    });
  });

  it("navigates to register page via link", () => {
    cy.get("a").contains("Registrieren").click();
    cy.url().should("include", "/register");
  });
});

// ---------------------------------------------------------------------------

describe("Register page", () => {
  beforeEach(() => {
    cy.clearAllLocalStorage();
    cy.visit("/register");
  });

  it("displays register heading", () => {
    cy.get("h1").should("contain.text", "Registrieren");
  });

  it("shows error on conflict (username already taken)", () => {
    // "Admin" already exists in the backend → triggers 409
    cy.get('input[name="username"]').type("Admin");
    cy.get('input[name="email"]').type("admin_conflict@test.com");
    cy.get('input[name="password"]').type("Test1234");
    cy.get('input[name="firstName"]').type("John");
    cy.get('input[name="lastName"]').type("Doe");
    cy.get('input[name="licenseNumber"]').type("L1");
    cy.get('input[name="licenseValidUntil"]').type("2030-01-01");
    cy.get('button[type="submit"]').click();
    cy.contains("Benutzername oder E-Mail bereits vergeben.").should("be.visible");
  });

  it("redirects to /login after successful registration", () => {
    cy.get('input[name="username"]').type("cy_register_user2");
    cy.get('input[name="email"]').type("cy_register2@test.com");
    cy.get('input[name="password"]').type("Test1234");
    cy.get('input[name="firstName"]').type("John");
    cy.get('input[name="lastName"]').type("Doe");
    cy.get('input[name="licenseNumber"]').type("L1");
    cy.get('input[name="licenseValidUntil"]').type("2030-01-01");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/login");
  });

  it("navigates to login page via link", () => {
    cy.get("a").contains("Anmelden").click();
    cy.url().should("include", "/login");
  });
});

// ---------------------------------------------------------------------------

describe("Logout", () => {
  it("logs out and clears session", () => {
    cy.loginAsAdmin();
    cy.visit("/admin");
    cy.contains("Abmelden").click();
    cy.window().its("localStorage").invoke("getItem", "token").should("be.null");
    cy.url().should("include", "/login");
  });
});
