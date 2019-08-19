//display

//libraries
var libraries = document.querySelectorAll(".libtab");
/* if(libraries != null){
    for(var i = 0; i < libraries.length; i++){
        new Vue({
            el: "#"+libraries[i].id,
            data: function(){
                return {
                    isDisplay: true,
                    isActive: false,
                }
            },
            methods: {
                activateTab: function(){
                    if(activeTab != null){
                        activeTab.isActive = false;
                    }
                    var activeTab = this;
                    this.isActive = true;
                    console.log("onclick: " + this.isActive);
                }
            }
        })
    }
} */

// sidebar
var sidebar = new Vue({
    el: '#sidebar',
    data: function(){
        return{
            isNewLib: false,
            activeTab: '',
        }
    },
    computed: {
        activeLibId: function(){
            
        },
    },
    methods: {
        removeActiveTab: function(){
            //reset activeTab class
            if(this.activeTab === null || this.activeTab === ""){
                return;
            }
            let resetTab = document.getElementById(this.activeTab);
            if(resetTab !== null){
                resetTab.classList.remove("active");
                //hide edit form
                resetTab.querySelector("li").hidden = false;
                resetTab.querySelector("form").hidden = true;
            }
            //reset the value of activeTab
            this.activeTab = "";
        },
        add: function(){
            this.removeActiveTab();
            this.isNewLib = true;
            return;
        },
        edit: function(){
            /* if(activeTab != null){
                activeTab.isDisplay = false;
            } */
            if(this.activeTab === null || this.activeTab === ""){
                return;
            }
            let editlib = document.getElementById(this.activeTab);
            if(editlib !== null){
                editlib.querySelector("li").hidden = true;
                editlib.querySelector("form").hidden = false;
            }
        },
        activateTab: function(lib_id) {
            this.isNewLib = false;

            this.removeActiveTab();

            this.activeTab = lib_id;
            let activeDiv = document.getElementById(lib_id);
            if(activeDiv !== null)
                activeDiv.classList.add("active");
        },
        delete: function(){
            if(this.activeTab === "" || this.activeTab === null){
                return;
            }
            
            var deleteForm = document.getElementById("delete-lib");
            deleteForm.submit();

            this.removeActiveTab();
        } 
    }
});
