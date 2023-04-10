import { Page } from "@playwright/test";

export default class Home {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    spanSignIn = () => this.page.locator('#idcta-username')
    divSearch = () => this.page.locator('div[role="search"]')
    linkHeader = () => this.page.locator('nav.international').getByRole('link')
}