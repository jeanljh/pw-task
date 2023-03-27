import test, { expect } from '../fixtures/modules'
import data from '../fixtures/data.json'

test.beforeEach(async ({page, home}) => {
    await home.navHome()
    await expect(page).toHaveURL(data.urlBase)
})

test('Test - BBC Search', async ({page, home, searchBBC}) => {
    await home.divSearch().click()
    await searchBBC.inputSearch().fill(data.searchValue)
    expect(await searchBBC.inputSearch().inputValue()).toBe(data.searchValue)
    await searchBBC.btnSearch().click()
    const newsCount = await searchBBC.listNews().count()
    const matchedTitleCount = await searchBBC.linkTitle(data.searchValue).count()
    expect(newsCount).toBe(matchedTitleCount)
})

test('Test - e2e Register for under age', async ({page, home, loginRegister}) => {
    await home.spanSignIn().click()
    await loginRegister.linkName('register now').click()
    await loginRegister.linkName('under').click()
    await loginRegister.btnOK().click()
    await page.waitForURL('')
})

test('Test - e2e Register for over age', async ({page, home, loginRegister, account, emailApi }) => {
    await home.spanSignIn().click()
    await loginRegister.linkName('register now').click()
    await loginRegister.linkName('over').click()
    await loginRegister.inputDay().fill(data.day)
    await loginRegister.inputMonth().fill(data.month)
    await loginRegister.inputYear().fill(data.year)
    await loginRegister.btnSubmit().click()
    const email = await emailApi.genRandomEmail()
    await loginRegister.inputEmail().fill(email)
    await loginRegister.inputPassword().fill(data.password)
    await loginRegister.btnSubmit().click()
    await page.goto(await emailApi.getVerifyEmailLink())
    await page.goto(data.urlAccountSettings)
    expect(await account.divEmail().innerText()).toBe(email)
    await account.linkDeleteAccount().click()
    await account.inputPassword().fill(data.password)
    await account.btnDeleteAccount().click()
    await page.waitForURL(data.urlAccountDeleted)
})

test('Test - login with valid email account', async ({page, home, loginRegister, account}) => {
    await home.spanSignIn().click()
    await loginRegister.inputEmail().fill(data.validEmail)
    await loginRegister.inputPassword().fill(data.password)
    await loginRegister.btnSubmit().click()
    await page.waitForURL('')
    await expect(home.spanSignIn()).toHaveText('Your account')
    await page.goto(data.urlAccountSettings)
    expect(await account.divEmail().innerText()).toBe(data.validEmail)
})

test('Test - login with invalid email account', async ({home, loginRegister}) => {
    await home.spanSignIn().click()
    await loginRegister.inputEmail().fill(data.invalidEmail)
    await loginRegister.inputPassword().fill(data.password)
    await loginRegister.btnSubmit().click()
    await expect(loginRegister.divErrorMsg()).toBeVisible()
})

test('Test - navigate header links', async ({page, home}) => {
    for (const link of await home.linkHeader().all()) {
        const href = await link.getAttribute('href') ?? ''
        await link.click()
        await page.waitForURL(href)
        await page.goto('')
    }
})
