var registerForm = new Vue({
    el : '#user-register',
    data : {
        username : '',
        nickname : '',
        password1 : '',
        password2 : '',
        password1IsValid : true,
        password2IsValid : true
    },
    methods : {
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
});
