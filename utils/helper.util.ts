
export default class Helper {

    static wait = async (duration: number) => new Promise(resolve => setTimeout(resolve, duration))
    static genRandomNumber = (max: number) => Math.floor(Math.random() * max)
}