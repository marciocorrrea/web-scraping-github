'use strict'
import axios from 'axios';

export default class HttpService {
    static async get(url) {
        try {
            const data = await axios.get(url, null);
            return [null, data];
        } catch (error) {
            return [error, null];
        }
    }
}