import ApiDataStore from './ApiDataStore';

export default class TrailStore extends ApiDataStore {
	constructor(flux){
		super();

		const TrailActionIds = flux.getActionIds('TrailActionIds');
		this.registerAsyncAction(TrailActionIds.fetch);

	}
	//get all the trail
	getTrails(){
		return this.getData();
	}
	//get all the trails that user id matches the name
	getTrailsUsers(userId){
		return this.getData().values()
			.filter(trail => trail.userId === userId)
			.reduce((map, trail) => {
				const trailId = trail.id;
				const obj = Object.assign({}, map);
				obj[trailId] = trail;
				return obj;
			});
	}

}