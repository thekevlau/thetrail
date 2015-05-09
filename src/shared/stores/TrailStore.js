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

	//get all the trails based on User ID
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

	//checks to see if two arrays have a common element
	hasSameTag(array1, array2){
		var map = {};
		array1.forEach(function(elem){
			map[elem] = true;
		});
		array2.forEach(function(elem){
			if(map[elem] === true){
				return true;
			}
		})
		return false;
	}

	//Get all the trails based on tags 
	getTrailsTags(tags){
		return this.getData().values()
		.filter(trail => hasSameTag(trail.tag,tags))
		.reduce((map, trail) => {
			const trailId = trail.id;
			const obj = Object.assign({}, map);
			obj[trailId] = trail;
			return obj;
		});
	}



}








