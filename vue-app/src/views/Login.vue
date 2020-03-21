<template>
  <div>
    <h1>登录</h1>
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="手机号" prop="tel">
        <el-input type="tel" v-model="ruleForm.tel" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Vue from "vue";
import { Form, FormItem, Input, Button,Notification } from "element-ui";
import axios from "axios";
Vue.use(Form)
  .use(FormItem)
  .use(Input)
  .use(Button);
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号码"));
      } else if (value.length !== 11) {
        callback(new Error("请输入正确格式的手机号码"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        tel: "18084020304",
        checkPass: "123",
        age: ""
      },
      rules: {
        tel: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.register();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    register() {
      axios
        .post("http://localhost:3000/api/users/login", {
          tel: this.ruleForm.tel,
          password: this.ruleForm.checkPass
        })
        .then(res => {
          const { code } = res.data;
          switch (parseInt(code)) {
            case 10888:
               this.$notify.success({
                title: "成功",
                message: "登录成功"
              });
              break;
            case 10000:
              this.$notify.error({
                title: "错误",
                message: "密码错误"
              });
              break;
            case 10808:
              this.$notify.warning({
                title: "警告",
                message: "该用户已注册"
              });
              break;
            default:
              break;
          }
        });
    }
  }
};
</script>