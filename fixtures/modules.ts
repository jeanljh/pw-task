import { test as base } from "@playwright/test";
import Home from "../pages/home.page";
import SearchBBC from "../pages/search-bbc.page";
import LoginRegister from "../pages/login-register.page";
import EmailApi from "../apis/email.api";
import Account from "../pages/account.page";

export const test = base.extend<{
    home: Home
    searchBBC: SearchBBC
    loginRegister: LoginRegister
    account: Account
    emailApi: EmailApi
}>({
    home: async ({page}, use) => {
        await use(new Home(page))
    },
    searchBBC: async ({page}, use) => {
        await use(new SearchBBC(page))
    },
    loginRegister:async ({page}, use) => {
        await use(new LoginRegister(page))
    },
    account: async ({page}, use) => {
        await use(new Account(page))
    },
    emailApi: async ({}, use) => {
        await use(new EmailApi())
    },
})

export default test
export const expect = test.expect