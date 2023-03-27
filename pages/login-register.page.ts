import { Page } from "@playwright/test";

export default class LoginRegister {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    linkName = (text: string = '') => this.page.getByRole('link', { name: text })
    btnOK = () => this.page.locator('#return-to-ptrt')
    inputDay = () => this.page.locator('#day-input')
    inputMonth = () => this.page.locator('#month-input')
    inputYear = () => this.page.locator('#year-input')
    btnSubmit = () => this.page.locator('#submit-button')
    inputEmail = () => this.page.locator('#user-identifier-input')
    inputPassword = () => this.page.locator('#password-input')
    divErrorMsg = () => this.page.locator('#form-message-general')
}