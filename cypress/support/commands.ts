/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      loginAsAdmin(): Chainable<void>
      createTestUser(
        username: string,
        email: string,
        options?: { isAdmin?: boolean }
      ): Chainable<Cypress.Response<{ id: number }>>
      deleteTestUser(id: number): Chainable<void>
    }
  }
}

/**
 * Logs in as Admin/Admin via a real backend request.
 * Sets the session cookie and localStorage so the React app
 * treats the session as authenticated admin.
 */
Cypress.Commands.add("loginAsAdmin", () => {
  cy.request("POST", "/auth/login", { username: "Admin", password: "Admin" }).then((resp) => {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem("userId", String(resp.body.userId))
        win.localStorage.setItem("isAdmin", String(resp.body.isAdmin))
      },
    })
  })
})

/**
 * Creates a test user via the admin API.
 * Yields the response so the caller can read the new user's id.
 */
Cypress.Commands.add("createTestUser", (username, email, options = {}) => {
  cy.request({
    method: "POST",
    url: "/admin/users",
    body: {
      username,
      email,
      password: "Test1234",
      firstName: "Test",
      lastName: "User",
      licenseNumber: "T1",
      licenseValidUntil: "2030-01-01",
      isAdmin: options.isAdmin ?? false,
    },
  })
})

/**
 * Deletes a user by ID via the admin API.
 * failOnStatusCode: false so afterEach cleanup never throws.
 */
Cypress.Commands.add("deleteTestUser", (id) => {
  cy.request({ method: "DELETE", url: `/admin/users/${id}`, failOnStatusCode: false })
})
