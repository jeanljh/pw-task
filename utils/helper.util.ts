
export default class Helper {

    static wait = async (duration: number) => new Promise(resolve => setTimeout(resolve, duration))
}