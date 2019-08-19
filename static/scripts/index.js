//data needed by the interface

var activeTab;
var activeContent;

//connect to thr server

//display

//libraries
var libraries = document.querySelectorAll(".libtab");
if(libraries != null){
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
                        activeTab = this;
                    }
                    this.isActive = true;
                }
            }
        })
    }
}

// sidebar
new Vue({
    el: '#sidebar',
    data: {
        isNewLib: false,
    },
    methods: {
        add: function(){
            this.isNewLib = true;
            return;
        },
        edit: function(){
            if(activeTab != null){
                activeTab.isDisplay = false;
            }
        },
    }
});
