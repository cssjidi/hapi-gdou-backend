const JWT = require('jsonwebtoken');
const HapiJWT = require('hapi-jsonwebtoken');
const config = require('../config');
const app = require('../auth');
const secret = config.SECRETCODE;

module.exports = {
	async getUserInfo(req,h){
		const reply = {
			msg:'暂无内容',
			code:0
		};
		const uid = req.params.user
		const User = req.getModel('ims_mc_members');
		await User.findAndCountAll({
			where:{
				uid:uid,
			}
		}).then(result => {
			if(result.count > 0){
				reply.msg = '成功';
				reply.data = JSON.parse(JSON.stringify(result.rows[0]));
				delete reply.data.password
				delete reply.data.salt
				reply.code = 1;
			}
			return reply
		})
		return reply
	},
}