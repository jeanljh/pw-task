import test, { expect } from '../fixtures/modules'
import data from '../fixtures/data.json'
import Helper from '../utils/helper.util'

test.beforeEach(async ({page}) => {
    // go to home page
    await page.goto('', { waitUntil: 'networkidle' })
})

test('Test - BBC search', async ({home, searchBBC}) => {
    // click BBC Search on home page
    await home.divSearch().click()
    // enter search value and click search
    await searchBBC.inputSearch().fill(data.searchValue)
    expect(await searchBBC.inputSearch().inputValue(), 'entered search value').toBe(data.searchValue)
    await searchBBC.btnSearch().click()
    // total news items on current page
    const newsCount = await searchBBC.listNews().count()
     // total news titles that match or contain search value
    const matchedTitleCount = await searchBBC.linkTitle(data.searchValue).count()
    expect(matchedTitleCount, 'total matched news titles must be equal to or more than total news items').toBeGreaterThanOrEqual(newsCount)
})

test('Test - e2e register for under age', async ({page, home, loginRegister}) => {
    // register for under age
    await home.spanSignIn().click()
    await loginRegister.linkName('register now').click()
    await loginRegister.linkName('under').click()
    await loginRegister.btnOK().click()
    // ensure user is redirected to home page when attempt to register for under age
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
    await loginRegister.enterUserCredential(email, data.password)
    
    // get and open email verification link 
    await page.goto(await emailApi.getVerifyEmailLink())
    await page.goto(data.urlAccountSettings)
    
    expect(account.divVerifyEmailMsg(), 'email message does not show').toBeHidden()
    expect(await account.divEmail().innerText(), 'email in account settings is correct').toBe(email)
    
    // delete account and check account deletion is successful
    await account.linkDeleteAccount().click()
    await account.inputPassword().fill(data.password)
    await account.btnDeleteAccount().click()
    await page.waitForURL(data.urlAccountDeleted)
})

test('Test - login with valid email account', async ({page, home, loginRegister, account}) => {
    // login with valid email
    await home.spanSignIn().click()
    await loginRegister.enterUserCredential(data.validEmail, data.password)
    // ensure user is redirected to home page after successful login
    await page.waitForURL('')
    // go to account settings
    await page.goto(data.urlAccountSettings)
    expect(await account.divEmail().innerText(), 'email in account settings is correct').toBe(data.validEmail)
})

test('Test - login with invalid email account', async ({home, loginRegister}) => {
    // login with invalid email
    await home.spanSignIn().click()
    await loginRegister.enterUserCredential(data.invalidEmail, data.password)
    await expect(loginRegister.divErrorMsg(), 'page shows error message when login with invalid email').toBeVisible()
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

test('Test - select country of residence', async ({page, home, loginRegister, account}) => {
    // login with valid email
    await home.spanSignIn().click()
    await loginRegister.enterUserCredential(data.validEmail, data.password)
    // ensure user is redirected to home page after successful login
    await page.waitForURL('')
    // go to edit location
    await page.goto(data.urlEditLocation)
    // get the index of the new location to select
    const index = Helper.genRandomNumber(await account.optionLocation().count())
    // get the location name based on the index
    const selectedOption = await account.optionLocation().nth(index).innerText()
    // select the new location and save
    await account.selectLocation().selectOption({index})
    await account.btnSave().click()
    await expect(account.divSavedMsg(), 'message shows location saved').toHaveText('location saved', { ignoreCase: true })
    await expect(account.divCountry(), 'correct country is selected').toHaveText(selectedOption)
})
