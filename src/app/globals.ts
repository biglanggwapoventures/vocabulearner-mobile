import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
    API_URL: string = 'http://vocabulearner.liteonebiz.tech/api/';
    apiUrl(segment) {
        return `${this.API_URL}${segment}`;
    }
}