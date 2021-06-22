<template>
    <div class="login-content">
        <h1 class="title">
            <img class="logo" src="../assets/logo1.png" alt="">
        </h1>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="meddle" class="login-form">
            <el-form-item prop="account">
                <el-input type="text" prefix-icon="el-icon-user" v-model="ruleForm.account" placeholder="请输入域账号" clearable></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" @keyup.enter.prevent="submitForm($event, 'ruleForm')" prefix-icon="opsfont ops-icon-mima" v-model="ruleForm.password" placeholder="请输入密码" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="submit-btn" type="primary" @click="submitForm('click','ruleForm')">登 录</el-button>
            </el-form-item>
        </el-form>
        <div class="tips">
            请使用 zmdesk 域账号登录 <a href="http://confluence.zmops.cc/pages/viewpage.action?pageId=36560349" target="_blank;">帮助</a>
        </div>
  </div>
</template>

<script>
import {login} from '../services/index';
export default {
    data(){
        return{
            ruleForm:{
                account: "",
                password: ""
            },
            rules: {
                account: { required: true, message: '请输入域账号', trigger: 'blur' },
                password: { required: true, message: '请输入密码', trigger: 'blur' }
            }
        }
    },
    methods: {
        submitForm(type, formName){
            if(type !=  "click"){
                let keyCode = window.event ? type.keyCode : type.which;
                console.log(keyCode)

                if (keyCode != 13) return
            }
            this.$refs[formName].validate((valid) => {
            if (valid) {
                login({
                    username: this.ruleForm.account,
                    password: this.ruleForm.password
                }).then(res => {
                    console.log(111, res)
                    this.$message.success("登录成功!")
                    location.reload()
                }).catch(()=>{
                    this.$message.error("登录失败，请检查域账号是否正确!")
                })
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        }
    }
}
</script>

<style lang="less" scoped>
.login-content{
    .title{
        padding-bottom: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .submit-btn{
        width: 100%;
    }
    .tips {
        width: 100%;
        text-align: center;
        font-size: 12px;
        color: #8a8a8a;
  }
}
</style>