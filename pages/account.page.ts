import { Page } from "@playwright/test";

export default class Account {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    divEmail = () => this.page.locator('#Email-field div.field__input')
    inputPassword = () => this.page.locator('#password-input')
    divVerifyEmailMsg = () => this.page.locator('div.sb-feedback--warning')
    divSavedMsg = () => this.page.locator('div[data-bbc-title="general-message"] p.form-message__title')
    divCountry = () => this.page.locator('div.u-capitalise-first-word')
    linkDeleteAccount = () => this.page.getByRole('link', { name: /i want to delete my account/i })
    btnDeleteAccount = () => this.page.getByRole('button', { name: /delete account/i })
    selectLocation = () => this.page.locator('#location-select')
    optionLocation = () => this.selectLocation().locator('option')
    btnSave = () => this.page.getByRole('button', { name: /save and continue/i })
}