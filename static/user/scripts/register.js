var registerForm = new Vue({
    el : '#user-register',
    data : {
        username : '',
        nickname : '',
        password1 : '',
        password2 : '',
        usernameHelptext : "请输入您的电子邮件地址作为用户名，长度需小于150字符。",
        passwordHelptext : "请输入长度在8 ~ 30位之间的密码，可包含特殊字符。",
        usernameError : "该邮箱已被注册！",
        password1Error : "密码长度不符合要求！",
        password2Error : "两次输入密码不一致！",
        //username_is_valid : true,
        password1IsValid : true,
        password2IsValid : true
    },
    method : {
        formCheck : function(event){
            if(this.username.length < 1){
                event.preventDefault();
                alert("邮箱不可为空");
            }
            if(this.nickname.length < 1){
                event.preventDefault();
                alert("昵称不可为空");
            }
            if(this.password1.length < 1){
                event.preventDefault();
                alert("密码不可为空");
            }

            //check password1
            this.password1IsValid = this.password1.length >= 8 && this.password1.length <= 30;
            if(!this.password1IsValid){
                event.preventDefault();
                return;
            }

            //check password2
            this.password2IsValid = this.password1 === this.password2;
            if(!this.password2IsValid){
                event.preventDefault();
                return;
            }
                
            //check username ---- submit
            return true;
        }
    }
})
