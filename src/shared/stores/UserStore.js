import ApiDataStore from './ApiDataStore';

export default class UserStore extends ApiDataStore {
    constructor(flux){
        super();

        const UserActionIds = flux.getActionIds('UserActions');
        this.registerAsyncAction(UserActionIds.fetch);
        this.registerAsyncAction(UserActionIds.getCurrentUser, this.handleFetchCurrentUser);
    }

    getUsers(){
        return this.getData();
    }

    getCurrentUser(){
        return this.getProp('currentUser');
    }

    handleFetchCurrentUser(currentUser){
        this.setProp('currentUser', currentUser);
    }
}
