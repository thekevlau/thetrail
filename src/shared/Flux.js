import { Flummox } from 'flummox';

import UiActions from './actions/UiActions';
import UiStore from './stores/UiStore';

export default class Flux extends Flummox {
    constructor(){
        super();

        this.createActions('UiActions', UiActions);
        this.createStore('UiStore', UiStore, this);
    }
};
