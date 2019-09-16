'use strict';

const User = require('../controller/user')
const auth = require('../auth');
module.exports = [
	{
		method: 'POST',
	    path: '/login',
	    config: { auth: false },
	    handler: (request, h) => auth.getInvalidUserToken(request,h)
	},
	{
		method: 'GET',
	    path: '/user/{user}',
	    config: { auth: 'jwt' },
	    handler: (request, res) => User.getUserInfo(request, res)
	},
]
