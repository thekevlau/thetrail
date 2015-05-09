import ApiDataStore from './ApiDataStore';

export default class TrailStore extends ApiDataStore {
	constructor(flux){
		super();

		const TrailActionIds = flux.getActionIds('TrailActionIds');
		this.registerAsyncAction(TrailActionIds.fetchTrailsForUser);

	}

	getTrails(){
		return this.getData();
	}

	getTrailsForUser(userId){
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
