function createApi(rootUrl, baseObj = {}, ...interceptors) {
  let handler = {
    get: function(target, property, receiver) {
      if(Reflect.has(target, property)) {
        return this.compose(Reflect.get(target, property, receiver), interceptors);
      }

      const { rootUrl } = target;
      if(property.indexOf('findBy') === 0) {
        let propertyNames = property
          .substring('findBy'.length)
          .split('And')
          .map(s => s.toLowerCase());
        let findBy = (...args) =>  {

          // filters
          let params = [];
          for(let i = 0; i < propertyNames.length; i++) {
            let propValue = args[i]
            if(typeof propValue === 'object') {
              params = params.concat(Object.keys(propValue).map(key => `${propertyNames[i]}_${key}=${propValue[key]}`))
            }
            else {
              params.push(`${propertyNames[i]}=${args[i]}`);
            }
          }

          // sort and pagination
          let options = args.length > propertyNames.length ? args[args.length - 1] : {};
          params = params.concat(Object.keys(options).map(op => `_${op}=${options[op]}`));

          // request
          return axios.get(`${rootUrl}?${params.join('&')}`);
        }
        return this.compose(findBy, interceptors);
      }
      throw new Error(`no property found: ${property}`);
    },
    compose : function(result, interceptors) {
      interceptors.forEach(interceptor => {
        result = new Proxy(result, interceptor);
      })
      return result;
    }
  }

  // base object defines crud operator
  let obj = {
    create(data) {
      return axios.post(`${rootUrl}`, data);
    },
    find(id) {
      return axios.get(`${rootUrl}/${id}`);
    },
    findAll(options = {}) {
      let pageAndSort = Object.keys(options).map(op => `_${op}=${options[op]}`).join('&');
      return axios.get(`${rootUrl}?${pageAndSort}`);
    },
    update(id, data) {
      return axios.put(`${rootUrl}/${id}`, data);
    },
    delete(id) {
      return axios.delete(`${rootUrl}/${id}`);
    }
  }

  return new Proxy({ ...obj, ...baseObj, rootUrl }, handler)
}

// // other handlers
const responseHandler = {
    apply: function(target, thisArg, argumentsList) {
      let result = Reflect.apply(target, thisArg, argumentsList)
		  result.then && result.then(({ data }) => {
        console.log('========================');
      	console.table(Array.isArray(data) ? data : [data]);
        console.log('========================');
		  }).catch();
      return result;
    }
}
