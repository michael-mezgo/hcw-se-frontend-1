// ---------------------------------------------------------------------------
// Admin E2E tests – uses real backend (H2, starts with only Admin/Admin)
// ---------------------------------------------------------------------------

describe("Admin – redirect for non-admins", () => {
  it("redirects non-admin users away from /admin", () => {
    cy.visit("/admin/users", {
      onBeforeLoad(win) {
        win.localStorage.setItem("userId", "2")
        win.localStorage.setItem("isAdmin", "false")
      },
    })
    cy.url().should("not.include", "/admin")
  })

  it("redirects unauthenticated users away from /admin", () => {
    cy.clearAllLocalStorage()
    cy.visit("/admin/users")
    cy.url().should("not.include", "/admin")
  })
})

// ---------------------------------------------------------------------------

describe("Admin users list", () => {
  let activeUserId: number
  let lockedUserId: number

  beforeEach(() => {
    cy.loginAsAdmin()

    cy.createTestUser("cy_active", "cy_active@test.com").then((r) => {
      activeUserId = r.body.id
    })

    cy.createTestUser("cy_locked", "cy_locked@test.com").then((r) => {
      lockedUserId = r.body.id
      cy.lockTestUser(r.body.id)
    })

    cy.visit("/admin/users")
  })

  afterEach(() => {
    cy.deleteTestUser(activeUserId)
    cy.deleteTestUser(lockedUserId)
  })

  it("displays User management heading", () => {
    cy.get("h1").should("contain.text", "User management")
  })

  it("shows total user count", () => {
    cy.contains("3 Users in total").should("exist")
  })

  it("renders all users in table", () => {
    cy.contains("Admin").should("exist")
    cy.contains("cy_active").should("exist")
    cy.contains("cy_locked").should("exist")
  })

  it("shows Admin badge for admin users", () => {
    cy.contains("tr", "Admin").contains("Admin").should("exist")
  })

  it("shows Locked badge for locked user", () => {
    cy.contains("tr", "cy_locked").contains("Locked").should("exist")
  })

  it("shows Active badge for active user", () => {
    cy.contains("tr", "cy_active").contains("Active").should("exist")
  })

  it("has link to create new user", () => {
    cy.contains("a", "+ Add User").should("have.attr", "href", "/admin/users/new")
  })

  it("navigates to user detail on username click", () => {
    cy.contains("a", "cy_active").click()
    cy.url().should("include", "/admin/users/")
  })

  it("locks an active user", () => {
    cy.contains("tr", "cy_active").contains("button", "Lock").click()
    cy.contains("tr", "cy_active").contains("Locked").should("exist")
  })

  it("unlocks a locked user", () => {
    cy.contains("tr", "cy_locked").contains("button", "Unlock").click()
    cy.contains("tr", "cy_locked").contains("Active").should("exist")
  })

  it("removes user from list after deletion", () => {
    cy.on("window:confirm", () => true)
    cy.contains("tr", "cy_active").contains("button", "Delete").click()
    cy.contains("cy_active").should("not.exist")
  })
})

// ---------------------------------------------------------------------------

describe("Admin create user", () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.visit("/admin/users/new")
  })

  it("displays new user heading", () => {
    cy.get("h1").should("contain.text", "New User")
  })

  it("shows error on duplicate user", () => {
    // "Admin" already exists in the backend → triggers 409
    cy.get("input").eq(0).type("Admin")
    cy.get("input").eq(1).type("admin2@test.com")
    cy.get("input").eq(2).type("Test1234")
    cy.get("input").eq(3).type("John")
    cy.get("input").eq(4).type("Doe")
    cy.get("input").eq(5).type("L1")
    cy.get("input").eq(6).type("2030-01-01")
    cy.get('button[type="submit"]').click()
    cy.contains("User name or E-mail address already taken.").should("be.visible")
  })

  it("navigates to user detail after creation", () => {
    cy.get("input").eq(0).type("cy_brand_new")
    cy.get("input").eq(1).type("cy_brand@test.com")
    cy.get("input").eq(2).type("Test1234")
    cy.get("input").eq(3).type("Brand")
    cy.get("input").eq(4).type("New")
    cy.get("input").eq(5).type("BN1")
    cy.get("input").eq(6).type("2030-01-01")
    cy.get('button[type="submit"]').click()
    cy.url().should("include", "/admin/users/")
    // clean up the newly created user
    cy.url().then((url) => {
      const id = Number(url.split("/admin/users/")[1])
      cy.deleteTestUser(id)
    })
  })
})

// ---------------------------------------------------------------------------

describe("Admin user detail", () => {
  let detailUserId: number

  beforeEach(() => {
    cy.loginAsAdmin()
    cy.createTestUser("cy_detail", "cy_detail@test.com").then((r) => {
      detailUserId = r.body.id
      cy.visit(`/admin/users/${r.body.id}`)
    })
  })

  afterEach(() => {
    cy.deleteTestUser(detailUserId)
  })

  it("displays username as heading", () => {
    cy.get("h1").should("contain.text", "cy_detail")
  })

  it("pre-fills email in form", () => {
    cy.get('input[type="email"]').should("have.value", "cy_detail@test.com")
  })

  it("shows success after saving", () => {
    cy.get('button[type="submit"]').click()
    cy.contains("User updated successfully.").should("be.visible")
  })

  it("navigates back to users list after deletion", () => {
    cy.on("window:confirm", () => true)
    cy.contains("button", "Delete User").click()
    cy.url().should("include", "/admin/users")
    cy.url().should("not.include", "/admin/users/")
  })
})
