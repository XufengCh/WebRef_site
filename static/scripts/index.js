//display

//libraries
//var libraries = document.querySelectorAll(".libtab");
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
            //from this.activeTab get library_id
            if(this.activeTab === null || this.activeTab === ""){
                return null;
            }
            return Number(this.activeTab.slice(4, this.activeTab.length))
        },
    },
    methods: {
        getRefList: function(lib_id){
            if(lib_id === null || lib_id < 1)
                return null;

            // use axios to get ref list
            //content.refsAvailable = false;
            axios.get('/ref/get-lib', {
                params: {
                    library_id: lib_id,
                }
            })
            .then(function(response){
                console.log("Getting Library Success...");
                console.log(response);

                //sidebar.refsList = response.data;
                //copy response.data
                content.refs = [];
                var temp = response.data;
                temp.forEach(function(val, index){
                   var ref = {};
                   ref['ref_id'] = val.ref_id;
                   ref['comment'] = val.comment;
                   var info = {};
                   for(var key in val.info){
                        info[key] = val.info[key];
                   }
                   ref['info'] = info;
                   content.refs.push(ref);
                });

//                content.refsAvailable = true;
            })
            .catch(function(error){
                console.log(error);
            });
        },
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

            //get library
            this.getRefList(this.activeLibId);
            //show default content
            content.setDefaultContent();
        },
        deleteLib: function(){
            if(this.activeTab === "" || this.activeTab === null){
                return;
            }
            
            var deleteForm = document.getElementById("delete-lib");
            deleteForm.submit();

            this.removeActiveTab();
        } 
    }
});

var content = new Vue({
    el: "#content",
    data: function(){
        return {
            showDefault: true,
            showAddTab: false,
//            refsAvailable: false,
            refs: [],
            activeRef: '',
        }
    },
    computed: {
        activeLibId: function(){
            return sidebar.activeLibId;
        },
    },
    methods: {
        setDefaultContent: function(){
            this.showDefault = true;
            this.showAddTab = false;
        },
        addRef: function(){
            if(this.activeLibId === null || this.activeLibId < 1)
                return;

            this.showDefault = false;
            this.showAddTab = true;
        },
        removeActiveRef: function(){
        },
        activateRef: function(ref_id){

        },
    }
})
