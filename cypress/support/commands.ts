/// <reference types="cypress" />

export {}

let authToken = ""

declare global {
  namespace Cypress {
    interface Chainable {
      loginAsAdmin(): Chainable<void>
      createTestUser(
        username: string,
        email: string,
        options?: { isAdmin?: boolean }
      ): Chainable<Cypress.Response<{ id: number }>>
      lockTestUser(id: number): Chainable<void>
      deleteTestUser(id: number): Chainable<void>
    }
  }
}

/**
 * Logs in as Admin/Admin via a real backend request.
 * Stores the JWT token in Cypress.env and localStorage so the React app
 * treats the session as authenticated admin.
 */
Cypress.Commands.add("loginAsAdmin", () => {
  cy.request("POST", "/auth/login", { username: "Admin", password: "Admin" }).then((resp) => {
    authToken = resp.body.token
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem("token", resp.body.token)
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
    url: "/users",
    headers: { Authorization: `Bearer ${authToken}` },
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
 * Locks a user by ID via the admin API.
 */
Cypress.Commands.add("lockTestUser", (id) => {
  cy.request({
    method: "PATCH",
    url: `/users/${id}`,
    headers: { Authorization: `Bearer ${authToken}` },
    body: { isLocked: true },
  })
})

/**
 * Deletes a user by ID via the admin API.
 * failOnStatusCode: false so afterEach cleanup never throws.
 */
Cypress.Commands.add("deleteTestUser", (id) => {
  cy.request({
    method: "DELETE",
    url: `/users/${id}`,
    headers: { Authorization: `Bearer ${authToken}` },
    failOnStatusCode: false,
  })
})
