# create-api
create-api is a library to create a REST client with support for CRUD operations and dynamic finders.


Give the sample data below and served via json-server. Let's take a look on how to query the data via create-api.

|   ID	|  Brand 	  |  Name 	                |  Warranty 	|  Instock 	|  RunFlat 	|  Price 	|
|---	  |---	      |---	                    | ---	        |---	      |---	      |---	    |
|  1 	  | Michelin  | Defender  	            | 50000  	    |  true 	  |  true 	  | 125.99  |
|  2 	  | Michelin  | Premier A/S  	          | 50000  	    |  true 	  |  true 	  | 155.99 	|
|  3 	  | Michelin  | Energy Saver  	        | 20000  	    |  true 	  |  false 	  | 129.99 	|
|  4 	  | Michelin  | Primacy MXM4  	        | 20000  	    |  false 	  |  true 	  | 154.99 	|
|  5 	  | Michelin  | Primacy MXV4  	        | 80000  	    |  false 	  |  false 	  | 154.99 	|
|  6 	  | Fuzion  	| Touring  	              | 50000  	    |  true 	  |  false 	  | 65.99  	|
|  7 	  | Fuzion  	| UHP  	                  | 50000  	    |  true 	  |  true 	  | 50.00  	|
|  8 	  | Goodyear  | Eagle LS  	            | 40000  	    |  true 	  |  true 	  | 129.99  |
|  9 	  | Goodyear  | Wrangler Radial  	      | 50000  	    |  false 	  |  true 	  | 125.99 	|
|  10 	| Goodyear  | Assurance All Season  	| 80000  	    |  true 	  |  false 	  | 115.99 	|

~~~~javascript
let api = createApi('http://localhost:3002/tires')
// regular CRUD operations
api.findAll() // returns all data
api.find(1) // return data with id of 1
api.create({ brand: 'Firestone', name: 'Winterforce', ...rest of data }) // create a new object
api.update(1, { name: 'Updated Name' }) //updates name of object with id of 1
api.delete(1) // deletes object with id of 1

// dynamic finders
api.findByBrand('Michelin') // translates query to ?brand=Michelin
api.findByBrandAndInStock('Michelin', true) // translates query to ?brand=Michelin&instock=true
api.findByWarranty({gte: 40000, lte: 60000}) //translates query to ?warranty_gte=40000&warranty_lte=60000
api.findByBrandAndWarranty('Michelin', {gte: 40000, lte: 60000}) //translates query to ?brand=Michelin&warranty_gte=40000&warranty_lte=60000
