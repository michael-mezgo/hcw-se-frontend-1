const mockUser = {
  id: 1,
  username: "testuser",
  email: "test@example.com",
  firstName: "John",
  lastName: "Doe",
  licenseNumber: "L123456",
  licenseValidUntil: "2030-01-01",
  isAdmin: false,
  isLocked: false,
};

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
    cy.intercept("POST", "/auth/login", { statusCode: 401, body: "Unauthorized" });
    cy.get('input[type="text"]').type("wronguser");
    cy.get('input[type="password"]').type("wrongpass");
    cy.get('button[type="submit"]').click();
    cy.contains("Ungültige Anmeldedaten.").should("be.visible");
  });

  it("redirects to /profile on successful login as regular user", () => {
    cy.intercept("POST", "/auth/login", { body: { userId: 1, isAdmin: false } });
    cy.intercept("GET", "/users/1", { body: mockUser });
    cy.get('input[type="text"]').type("testuser");
    cy.get('input[type="password"]').type("password123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/profile");
  });

  it("redirects to /admin on successful login as admin", () => {
    cy.intercept("POST", "/auth/login", { body: { userId: 1, isAdmin: true } });
    cy.intercept("GET", "/admin/users", { body: [] });
    cy.get('input[type="text"]').type("admin");
    cy.get('input[type="password"]').type("adminpass");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/admin");
  });

  it("navigates to register page via link", () => {
    cy.get("a").contains("Registrieren").click();
    cy.url().should("include", "/register");
  });
});

describe("Register page", () => {
  beforeEach(() => {
    cy.clearAllLocalStorage();
    cy.visit("/register");
  });

  it("displays register heading", () => {
    cy.get("h1").should("contain.text", "Registrieren");
  });

  it("shows error on conflict (username or email taken)", () => {
    cy.intercept("POST", "/auth/register", { statusCode: 409, body: "Conflict" });
    cy.get('input[name="username"]').type("existinguser");
    cy.get('input[name="email"]').type("existing@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get('input[name="firstName"]').type("John");
    cy.get('input[name="lastName"]').type("Doe");
    cy.get('input[name="licenseNumber"]').type("L123456");
    cy.get('input[name="licenseValidUntil"]').type("2030-01-01");
    cy.get('button[type="submit"]').click();
    cy.contains("Benutzername oder E-Mail bereits vergeben.").should("be.visible");
  });

  it("redirects to /profile after successful registration", () => {
    cy.intercept("POST", "/auth/register", { body: { id: 2 } });
    cy.intercept("POST", "/auth/login", { body: { userId: 2, isAdmin: false } });
    cy.intercept("GET", "/users/2", {
      body: { ...mockUser, id: 2, username: "newuser" },
    });
    cy.get('input[name="username"]').type("newuser");
    cy.get('input[name="email"]').type("new@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get('input[name="firstName"]').type("John");
    cy.get('input[name="lastName"]').type("Doe");
    cy.get('input[name="licenseNumber"]').type("L1");
    cy.get('input[name="licenseValidUntil"]').type("2030-01-01");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/profile");
  });

  it("navigates to login page via link", () => {
    cy.get("a").contains("Anmelden").click();
    cy.url().should("include", "/login");
  });
});

describe("Logout", () => {
  it("logs out and clears session", () => {
    cy.visit("/login", {
      onBeforeLoad(win) {
        win.localStorage.setItem("userId", "1");
        win.localStorage.setItem("isAdmin", "false");
      },
    });
    cy.intercept("GET", "/users/1", { body: mockUser });
    cy.intercept("POST", "/auth/logout", { statusCode: 200 });
    cy.visit("/profile");
    cy.contains("Abmelden").click();
    cy.window().its("localStorage").invoke("getItem", "userId").should("be.null");
  });
});
