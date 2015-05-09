import { Actions } from 'flummox';
import fetch from 'isomorphic-fetch';

export default class UserActions extends Actions {
    async fetch(userId){
        return {
            name: 'Shahmeer Navid',
            id: '0'
        };
    }

    async fetchCurrentUser(){
        return {
            name: 'Alexander Fung',
            id: '0'
        };
    }
}
