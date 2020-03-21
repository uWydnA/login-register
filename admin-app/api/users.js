var express = require('express');
var router = express.Router();
var sql = require("./../sql/index")
var User = require('./../sql/col/col')
var uuid = require('node-uuid')
/* 登录注册等接口 */
router.get('/', function(req, res, next) {
  res.send('用户相关接口');
});
/**
 * @api {post} /api/users/login 登录接口
 * @apiDescription 登录接口
 * @apiGroup users
 * @apiParam {string} tel 手机号码
 * @apiParam {string} password 手机号码
 * @apiSuccessExample {json} Success-response:
 *  res.send({
        code:'10808',
        message:'用户还未注册'
    })
    res.send({
        code:'10000',
        message:'密码错误'
    })
     res.send({
      code:'10888',
      message:"登录成功"
    })
  *  @apiSampleRequest /api/users/login
  *  @apiVersion 1.0.0
 */
router.post('/login', function(req, res, next) {
  let {tel,password} = req.body
  sql.find(User,{tel},{_id:0}).then(data=>{
    if(data.length===0){
      res.send({
        code:'10808',
        message:'用户还未注册'
      })
    }else{
      sql.find(User,{tel,password},{_id:0}).then(data=>{
        if(data.length ===0){
          res.send({
            code:'10000',
        message:'密码错误'
          })
        }else(
          res.send({
            code:'10888',
            message:"登录成功"
          })
        )
      })
    }
  })
});
//编写接口文档 cnpm i apidoc -g 配置生成接口文档的规则 package.json中,输出：apidoc -i api/ -o public/apidoc
/**
 * @api {post} /api/users/register 注册接口
 * @apiDescription 注册接口
 * @apiGroup users
 * @apiParam {string} tel 手机号码
 * @apiParam {string} password 手机号码
 * @apiSuccessExample {json} Success-response:
 *  res.send({
          code:'10666',
          message:'注册成功'
    })
    res.send({
        code:'10606',
        message:'该用户已注册'
    })
     res.send({
      code:'10000',
      message:'请先完善您的信息'
    })
  *  @apiSampleRequest /api/users/register
  *  @apiVersion 1.0.0
 */
router.post('/register', function(req, res, next) {
  //1.手机号码 + 密码
  // post:req.body
  // get req.query
  let {tel,password} = req.body
  //判断用户有没有输入
  if(!tel || !password){
    res.send({
      code:'10000',
      message:'请先完善您的信息'
    })
  }
  sql.find(User,{tel},{_id:0}).then(data=>{
    if(data.length ===0){
      sql.insert(User, {
        userid:'user_' + uuid.v1(),
        nickname:'默认昵称',
        age:18,
        sex:-1,//1为男，0为女，-1是没有选择
        flag:1,
        tel,
        password
      }).then(()=>{
        res.send({
          code:'10666',
          message:'注册成功'
        })
      })
    }else{
      res.send({
        code:'10606',
        message:'该用户已注册'
      })
    }
  })
  // res.send({tel,password})
  2.//根据数据库判断当前的用户存不存在，如果存在则显示用户已注册，如果不存在，直接注册
});

module.exports = router;
