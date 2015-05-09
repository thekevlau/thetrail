import BaseStore from './BaseStore';

export default class ApiDataStore extends BaseStore {
    constructor(flux){
        super();

        this.state = {
            error: null,
            data: null,
            fetching: false,
            props: {}
        };
    }

    getData(){
        return this.state.data;
    }

    getProp(key){
        return this.state.props[key];
    }

    setProp(key, value){
        const obj = {};
        obj[key] = value;
        this.setState({props: Object.assign(obj, this.state.props)});
    }

    registerAsyncAction(action, success=function(){}){
        this.registerAsync(action, this.handleBegin,
            this.handleSuccess.bind(this, success), this.handleError);
    }

    handleBegin(){
        this.setState({fetching: true, error: null});
    }

    handleError(error){
        this.setState({fetching: false, error: error});

    }

    handleSuccess(success, data){
        const newData = Object.assign({}, this.state.data, data);
        this.setState({fetching: false, error: error, data: newData});
        success(data);
    }
}
