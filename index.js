
const ASYNCPROTO = Object.getPrototypeOf(async function(){}),
	ASYNCGENERATORPROTO = Object.getPrototypeOf(async function*() {}());

export function generx(f,recursed) {
	const generator = typeof(f)==="function" ? f("") : f,
		proto = Object.getPrototypeOf(generator),
		isasync = Object.getPrototypeOf(generator).constructor===ASYNCGENERATORPROTO.constructor;
	if(isasync) {
		proto.every = async function(f) {
			for(let i=0;await this.proxy[i] && i<this.length;i++) {
				if(!(await f(this[i],i,this))) return false;
			}
			return true;
		}
		proto.finalize = async function() {
			for(let i=0;await this.proxy[i] && i<this.length;i++) {
				;
			}
			return this.length;
		}
		proto.find = async function(f) {
			for(let i=0;await this.proxy[i] && i<this.length;i++) {
				if(await f(this[i],i,this)) return this[i];
			}
		}
		proto.findIndex = async function(f) {
			for(let i=0;await this.proxy[i] && i<this.length;i++) {
				if(await f(this[i],i,this)) return i;
			}
		}
		proto.forEach = async function(f) {
			for(let i=0;await this.proxy[i] && i<this.length;i++) {
				await f(this[i],i,this);
			}
		}
		proto.includes = async function(value) {
			for(let i=0;await this.proxy[i] && i<this.length;i++) {
				if(this[i]===value) {
					return true;
				}
			}
			return false;
		}
		proto.indexOf = async function(value) {
			for(let i=0;await this.proxy[i] && i<this.length;i++) {
				if(this[i]===value) {
					return i;
				}
			}
			return -1;
		}
		proto.lastIndexOf = async function(value) {
			let last = -1;
			for(let i=0;await this.proxy[i] && i<this.length;i++) {
				if(this[i]===value) {
					last = i;
				}
			}
			return last;
		}
		proto.map = async function*(f) {
			for(let i=0;await this.proxy[i] && i<this.length;i++) {
				yield await f(this[i],i,this);
			}
		}
		if(!recursed) proto.map = generx(proto.map,true);
		proto.reduce = async function(f,accum) {
			let initialized = accum!==undefined;
			for(let i=0;await this.proxy[i] && i<this.length;i++) {
				if(initialized) {
					accum = await f(accum,this[i],i,this);
				} else {
					accum = this[i];
					initialized = true;
				}
			}
			return accum;
		}
		proto.reverse = async function*() {
			const result = [];
			for(let i=0;i<this.length;i++) {
				result.unshift(await this.proxy[i]);
			}
			return generx(async function*() { 
				while(result.length>0) {
					yield result.pop();
				}
			})();
		}
		proto.slice = async function*(start=0,end=Infinity) {
			for(let i=start,j=0;i<end && await this.proxy[i] && i<this.length;i++,j++) {
					yield this[i];
			}
		}
		if(!recursed) proto.slice = generx(proto.slice,true);
		proto.sort = async function(f) {
			return this.slice().sort(f)
		}
		proto.some = async function(f) {
			let i = 0;
			for(let i=start;await this.proxy[i] && i<this.length;i++) {
				if(await f(this[i],i,this)) return true;
			}
		}
	} else {
		proto.every = function(f) {
			for(let i=0;i<this.length;i++) {
				if(!f(this.proxy[i],i,this)) return false;
			}
			return true;
		}
		proto.finalize = function() {
			for(let i=0;i<this.length;i++) {
				this.proxy[i];
			}
			return this.length;
		}
		proto.find = function(f) {
			for(let i=0;i<this.length;i++) {
				const item = this.proxy[i];
				if(f(item,i,this)) return item;
			}
		}
		proto.findIndex = function(f) {
			for(let i=0;i<this.length;i++) {
				if(f(this.proxy[i],i,this)) return i;
			}
		}
		proto.forEach = function(f) {
			for(let i=0;i<this.length;i++) {
				f(this.proxy[i],i,this);
			}
		}
		proto.includes = function(value) {
			for(let i=0;i<this.length;i++) {
				if(this.proxy[i]===value) {
					return true;
				}
			}
			return false;
		}
		proto.indexOf = function(value) {
			for(let i=0;i<this.length;i++) {
				if(this.proxy[i]===value) {
					return i;
				}
			}
			return -1;
		}
		proto.lastIndexOf = function(value) {
			let last = -1;
			for(let i=0;i<this.length;i++) {
				if(this.proxy[i]===value) {
					last = i;
				}
			}
			return last;
		}
		proto.map = function*(f) {
			for(let i=0;i<this.length;i++) {
				yield f(this.proxy[i],i,this);
			}
		}
		if(!recursed) proto.map = generx(proto.map,true);
		proto.reduce = function(f,accum) {
			let initialized = accum!==undefined;
			for(let i=0;i<this.length;i++) {
				if(initialized) {
					accum = f(accum,this.proxy[i],i,this);
				} else {
					accum = this.proxy[i];
					initialized = true;
				}
			}
			return accum;
		}
		proto.reverse = function() {
			const result = [];
			for(let i=0;i<this.length;i++) {
				result.unshift(this.proxy[i]);
			}
			return generx(function*() { 
				while(result.length>0) {
					yield result.pop();
				}
			})();
		}
		proto.slice = function*(start=0,end=Infinity) {
			for(let i=start,j=0;i<end && i<this.length;i++,j++) {
				yield this.proxy[i];
			}
		}
		if(!recursed) proto.slice = generx(proto.slice,true);
		proto.sort = function(f) {
			return this.slice().sort(f)
		}
		proto.some = function(f) {
			let i = 0;
			for(let i=start;i<this.length;i++) {
				if(f(this.proxy[i],i,this)) return true;
			}
		}
	}
	
	return new Proxy(f,{
		apply(target,thisArg,argumentsList) {
			let length = Infinity;
			const generator = target.call(thisArg,...argumentsList),
				yielded = [],
				proxy = new Proxy(generator,{
					get(target,property) {
						if(typeof(property)==="symbol") {
							return target[property];
						}
						const i = parseInt(property);
						if(i>=0) {
							if(i<yielded.length-1) {
								return yielded[i];
							}
							let next = generator.next();
							while(length===Infinity && !next.done) {
								let value = isasync ? next : next.value;
								if(isasync) {
									const j = yielded.length;
									next.then(item => { 
										if(item.done) {
											length = yielded.length = Math.min(j,yielded.length);
											delete target[j];
											delete target[j+1];
										} else {
											target[j] = yielded[j] = item.value;
										}
										return item.value;
									});
								}
								target[yielded.length] = yielded[yielded.length] = value;
								if(i<yielded.length-1) {
									return yielded[i];
								}
								// peek ahead so length gets set properly
								next = generator.next();
								value = isasync ? next : next.value;
								if(isasync) {
									const k = yielded.length;
									next.then(item => { 
										if(item.done) {
											length = yielded.length = Math.min(k,yielded.length);
											delete target[k];
											delete target[k+1];
										} else {
											target[k] = yielded[k] = item.value;
										}
										return item.value;
									});
								} else {
									if(next.done) {
										length = yielded.length;
									} else {
										target[yielded.length] = yielded[yielded.length] = value;
										next = generator.next();
									}
								}
							}
							length = yielded.length;
							return yielded[i];
						}
						const value = target[property];
						if(typeof(value)==="function") {
							return value.bind(target);
						}
						return value;
					},
					ownKeys(target) {
						target.finalize();
						return Object.keys(target).concat("length","proxy");
					}
				});
		Object.defineProperty(generator,"length",{get() { return length; },set(value) { length = yielded.length = value; }});
		Object.defineProperty(generator,"proxy",{value:proxy});
		return proxy;
		}
	});
}