import test, { expect } from '../fixtures/modules'
import data from '../fixtures/data.json'

test.beforeEach(async ({page, home}) => {
    // go to home page
    await home.navHome()
    await expect(page).toHaveURL(data.urlBase)
})

test('Test - BBC search', async ({home, searchBBC}) => {
    // click BBD Search on home page
    await home.divSearch().click()
    // enter search value and click search
    await searchBBC.inputSearch().fill(data.searchValue)
    expect(await searchBBC.inputSearch().inputValue()).toBe(data.searchValue)
    await searchBBC.btnSearch().click()
    // total news items on current page
    const newsCount = await searchBBC.listNews().count()
     // total news titles that match or contain search value
    const matchedTitleCount = await searchBBC.linkTitle(data.searchValue).count()
    // validate total matched news titles must be equal or more than total nnews items
    expect(matchedTitleCount).toBeGreaterThanOrEqual(newsCount)
})

test('Test - e2e register for under age', async ({page, home, loginRegister}) => {
    // register for under age
    await home.spanSignIn().click()
    await loginRegister.linkName('register now').click()
    await loginRegister.linkName('under').click()
    await loginRegister.btnOK().click()
    // ensure that page redirects to home page when attemp to register for under age
    await page.waitForURL('')
})

test('Test - e2e register for over age, verify email and delete account', async ({page, home, loginRegister, account, emailApi }) => {
    // register for over age
    await home.spanSignIn().click()
    await loginRegister.linkName('register now').click()
    await loginRegister.linkName('over').click()

    // enter day / month / year
    await loginRegister.inputDay().fill(data.day)
    await loginRegister.inputMonth().fill(data.month)
    await loginRegister.inputYear().fill(data.year)
    await loginRegister.btnSubmit().click()
    
    // generate random email via https://www.1secmail.com/api/v1/ endpoint
    const email = await emailApi.genRandomEmail()
    
    // enter email / password and submit
    await loginRegister.inputEmail().fill(email)
    await loginRegister.inputPassword().fill(data.password)
    await loginRegister.btnSubmit().click()
    
    // get and open email verification link 
    await page.goto(await emailApi.getVerifyEmailLink())
    await page.goto(data.urlAccountSettings)
    
    // validate verify email message does not show
    expect(account.divVerifyEmailMsg()).toBeHidden()
    
    // validate email in account settings is correct
    expect(await account.divEmail().innerText()).toBe(email)
    
    // delete account and validate account deletion is successful
    await account.linkDeleteAccount().click()
    await account.inputPassword().fill(data.password)
    await account.btnDeleteAccount().click()
    await page.waitForURL(data.urlAccountDeleted)
})

test('Test - login with valid email account', async ({page, home, loginRegister, account}) => {
    // login with valid email
    await home.spanSignIn().click()
    await loginRegister.inputEmail().fill(data.validEmail)
    await loginRegister.inputPassword().fill(data.password)
    await loginRegister.btnSubmit().click()
    // ensure that page redirects to home page after successful login
    await page.waitForURL('')
    // validate sign in link text changes to 'Your account'
    await expect(home.spanSignIn()).toHaveText('Your account')
    // go to account settings
    await page.goto(data.urlAccountSettings)
    // validate email in account settings is correct
    expect(await account.divEmail().innerText()).toBe(data.validEmail)
})

test('Test - login with invalid email account', async ({home, loginRegister}) => {
    // login with invalid email
    await home.spanSignIn().click()
    await loginRegister.inputEmail().fill(data.invalidEmail)
    await loginRegister.inputPassword().fill(data.password)
    await loginRegister.btnSubmit().click()
    // ensure page show error message when attemp to login with invalid email
    await expect(loginRegister.divErrorMsg()).toBeVisible()
})

test('Test - navigate menu headers', async ({page, home}) => {
    // loop through each menu header, get and click its link and ensure browser opens the correct page 
    for (const link of await home.linkHeader().all()) {
        const href = await link.getAttribute('href') ?? ''
        await link.click()
        await page.waitForURL(href)
        await page.goto('')
    }
})
