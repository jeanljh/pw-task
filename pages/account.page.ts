import { Page } from "@playwright/test";

export default class Account {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    divEmail = () => this.page.locator('#Email-field div.field__input')
    inputPassword = () => this.page.locator('#password-input')
    linkDeleteAccount = () => this.page.getByRole('link', { name: /i want to delete my account/i })
    btnDeleteAccount = () => this.page.getByRole('button', { name: /delete account/i })
}