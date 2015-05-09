import ApiDataStore from './ApiDataStore';
import ObjectUtils from '../utils/ObjectUtils';

export default class TrailStore extends ApiDataStore {
	constructor(flux){
		super();

		const TrailActionIds = flux.getActionIds('TrailActions');
		this.registerAsyncAction(TrailActionIds.fetchTrailsForUser);
		this.registerAsyncAction(TrailActionIds.fetchTrail);
	}

	getTrails(){
		return this.getData();
	}

	getTrail(trailId){
		return this.getData()[trailId];
	}

	getTrailsForUser(userId){
		const val = ObjectUtils.values(this.getData())
			.filter(trail => trail.userId === userId)
			.reduce((map, trail) => {
				const trailId = trail.id;
				const obj = Object.assign({}, map);
				obj[trailId] = trail;
				return obj;
			}, {});
		return val;
	}
}
