import { request, expect } from "@playwright/test";
import { urlEmailApi } from '../fixtures/data.json'
import Helper from "../utils/helper.util";

export default class EmailApi {

    private login: string = ''
    private domain: string = ''

    // create api context for https://www.1secmail.com/api/v1/
    async apiContext() {
        return await request.newContext({
            baseURL: urlEmailApi
        })
    }

    // generate random email via endpoint
    async genRandomEmail() {
        const req = await this.apiContext()
        const res = await req.get('', {
            params: {
                action: 'genRandomMailbox'
            }
        })
        expect(res.status()).toBe(200)
        const [email] = await res.json()
        const [login, domain] = email.split('@')
        this.login = login
        this.domain = domain
        return email
    }

    // check inbox for verify email link
    async getInboxWithRetry(maxRetries: number): Promise<any> {
        if (!maxRetries) return null
        const req = await this.apiContext()
        const res = await req.get('', {
            params: {
                action: 'getMessages',
                login: this.login,
                domain: this.domain
            }
        })
        expect(res.status()).toBe(200)
        const inbox = await res.json()
        if (!inbox.length) {
            await Helper.wait(2000)
            return await this.getInboxWithRetry(maxRetries - 1)
        }
        return inbox[0]['id']
    }

    // get verify email link from email
    async getVerifyEmailLink() {
        const id = await this.getInboxWithRetry(5)
        expect(id).not.toBeNull()
        const req = await this.apiContext()
        const res = await req.get('', {
            params: {
                action: 'readMessage',
                login: this.login,
                domain: this.domain,
                id
            }
        })
        expect(res.status()).toBe(200)
        const { body } = await res.json()
        const posStart = body.indexOf('https://account.bbc.com')
        const posEnd = body.indexOf('Verify')
        expect(posStart).not.toBe(-1)
        expect(posEnd).not.toBe(-1)
        return body.slice(posStart, posEnd - 1)
    }
}