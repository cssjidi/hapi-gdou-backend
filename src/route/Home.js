'use strict';
module.exports = [
	{
		method: 'GET',
	    path: '/',
	    handler: (request, h) => 'Hello Hapi'
	},
	{
		method: 'GET',
	    path: '/home',
	    async handler(request) {
            //const response = h.response({message: 'You used a Valid JWT Token to access /restricted endpoint!'});
	        //response.header("Authorization", request.headers.authorization);
	        return 'response';
        }
	}	
]
