import { Page } from "@playwright/test";

export default class SearchBBC {
    readonly page: Page

    constructor (page: Page) {
        this.page = page
    }

    inputSearch = () => this.page.locator('#search-input')
    btnSearch = () => this.page.getByTestId('test-search-submit')
    listNews = () => this.page.getByTestId('default-promo')
    linkTitle = (text: string) => this.page.getByRole('link', { 'name': text })
}