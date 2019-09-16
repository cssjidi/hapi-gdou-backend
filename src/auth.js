'use strict';
const crypto = require('crypto');
const md5 = crypto.createHash('md5');
const JWT = require('jsonwebtoken'); 

const config = require('./config');

const validate = async (decoded, request) => {
	let isValid = false;
	const User = request.getModel('ims_mc_members');
	await User.findAndCountAll({
		where:{
			uid:decoded.id,
			mobile:decoded.mobile,
		}
	}).then(result => {
		if(result.count > 0){
			isValid = true;
		}else{
			isValid = false;
		}
		return { isValid: isValid };
	})
    return { isValid: isValid };
};

const getInvalidUserToken = async (req,h) => {
	const { password,mobile } = req.payload;
	const User = req.getModel('ims_mc_members');
	const reply = {
		code:0,
		msg:'密码或账号信息不正确'
	}
	await User.findAndCountAll({
			where:{
				mobile:mobile,
			}
	}).then(result => {
		if(result.count > 0){
			const dbPassword = result.rows[0].password;
			const salt = result.rows[0].salt;
			const passwd = md5.update(password + salt + config.AUTHCODE).digest('hex');
			if(dbPassword === passwd){
				reply.msg = '登录成功';
				reply.code = 1;
				reply.token = JWT.sign({
					id:result.rows[0].uid,
					mobile:result.rows[0].mobile,
					email:result.rows[0].email,
				}, config.SECRETCODE);
			}else{
				reply.msg === '密码错误';
			}
		}else{
			reply.msg === '用户不存在';
		}
		return reply
	})
	return reply;
}

module.exports = {
    validate:validate,
    getInvalidUserToken:getInvalidUserToken
};