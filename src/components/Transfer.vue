<template>
     <div v-loading="loading" element-loading-text="正在努力迁移中...">
        <el-form  :model="form2" :rules="rules2" ref="form2"  label-width="115px">
            <el-form-item label="新项目名称" prop="name">
                <el-input style="width: 438px" v-model="form2.name" placeholder="请输入项目名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="css 链接" prop="url">
                <el-input style="width: 330px" v-model="form2.url" placeholder="请输入 iconfont css 链接地址" clearable></el-input>
                <!-- <a class="u-link" href="https://www.iconfont.cn/" target="_blank">打开 iconfont 复制链接</a> -->
                <el-button class="transfer-btn" type="primary" @click="next('form2')">一键迁移</el-button>
            </el-form-item>
            <p class="u-tips">* 填写地址如：//at.alicdn.com/t/font_1246635_1rd1nwr9kqp.css</p>
        </el-form>
    </div>
</template>

<script>
import { fontTransfer } from '../services/index';

export default {
    data(){
        return{
            active: 1,
            loading: false,
            form2: {
                name: "",
                url: ""
            },
            rules2: {
                name: [{ required: true, message: '请输入项目名', trigger: 'blur' }],
                url: [{ required: true, message: '请输入 iconfont css 链接地址', trigger: 'blur' }],
            }
        }
    },
    methods:{
        init(){
            this.$refs.form2.resetFields();
        },
        next(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loading = true
                    let url = this.form2.url
                    if(url.substr(0, 2) === "//"){
                        url =  `https:${url}`
                    }
                    fontTransfer({
                        name: this.form2.name,
                        url
                    }).then((res) =>{
                        this.$message.success("迁移成功！")
                        this.loading = false
                        this.$router.push({
                            path: '/projects',
                            query: {
                                type: 'own',
                                id: res.data._id
                            }
                        })
                        this.$emit('closeTransfer')
                    }).catch(err=>{
                        this.loading = false
                        this.$message.error(err.error)
                    })
                }else{
                    return false;
                }
            })
        },
    }
}
</script>

<style lang="less">
.m-transferBox .el-dialog__body{
    padding-top: 0px;
}
</style>

<style lang="less" scoped>


.m-steps{
    margin-bottom: 20px;
}
.btn-wrap {
  margin: 35px 0 -10px;
  display: flex;
  justify-content: space-between;
  &.first {
    text-align: right;
    display: block;
  }
}
.u-link{
    padding-left: 10px;
    text-decoration: none;
    font-size: 12px;
    color: #666;
    &:hover{
        color: #409EFF;
    }
}
.transfer-btn{
    margin-left: 10px;
}
.u-tips{
    text-align: center;
    font-size: 12px;
    color: #8a8a8a;
}
</style>