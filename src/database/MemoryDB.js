export default class MemoryDB {
    database;

    constructor() {
        this.database = [];
        this.cronCashClean();
    }

    cronCashClean(){
        setInterval(() => this.database = [], 600000);
    }

    getItem(url) {
        return this.database.find(item => item.url === url)
    }

    setItem(item) {
        this.database.push(item)
    }
}