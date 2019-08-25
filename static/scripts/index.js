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
  el: "#sidebar",
  data: function() {
    return {
      isNewLib: false,
      activeTab: ""
    };
  },
  computed: {
    activeLibId: function() {
      //from this.activeTab get library_id
      if (this.activeTab === null || this.activeTab === "") {
        return null;
      }
      return Number(this.activeTab.slice(4, this.activeTab.length));
    }
  },
  methods: {
    getRefList: function(lib_id) {
      if (lib_id === null || lib_id < 1) return null;

      // use axios to get ref list
      //content.refsAvailable = false;
      axios
        .get("/ref/get-lib", {
          params: {
            library_id: lib_id
          }
        })
        .then(function(response) {
          console.log("Getting Library Success...");
          console.log(response);

          //sidebar.refsList = response.data;
          //copy response.data
          content.refs = [];
          var temp = response.data;
          temp.forEach(function(val, index) {
            var ref = {};
            ref["ref_id"] = val.ref_id;
            ref["comment"] = val.comment;
            var info = {};
            for (var key in val.info) {
              info[key] = val.info[key];
            }
            ref["info"] = info;
            content.refs.push(ref);
          });

          //                content.refsAvailable = true;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    removeActiveTab: function() {
      //reset activeTab class
      if (this.activeTab === null || this.activeTab === "") {
        return;
      }
      let resetTab = document.getElementById(this.activeTab);
      if (resetTab !== null) {
        resetTab.classList.remove("active");
        //hide edit form
        resetTab.querySelector("li").hidden = false;
        resetTab.querySelector("form").hidden = true;
      }
      //reset the value of activeTab
      this.activeTab = "";
    },
    add: function() {
      this.removeActiveTab();
      this.isNewLib = true;
      return;
    },
    edit: function() {
      /* if(activeTab != null){
                activeTab.isDisplay = false;
            } */
      if (this.activeTab === null || this.activeTab === "") {
        return;
      }
      let editlib = document.getElementById(this.activeTab);
      if (editlib !== null) {
        editlib.querySelector("li").hidden = true;
        editlib.querySelector("form").hidden = false;
      }
    },
    activateTab: function(lib_id) {
      this.isNewLib = false;

      this.removeActiveTab();

      this.activeTab = lib_id;
      let activeDiv = document.getElementById(lib_id);
      if (activeDiv !== null) activeDiv.classList.add("active");

      //get library
      this.getRefList(this.activeLibId);
      //show default content
      content.setDefaultContent();
    },
    deleteLib: function() {
      if (this.activeTab === "" || this.activeTab === null) {
        return;
      }

      let deleteForm = document.getElementById("delete-lib");
      deleteForm.submit();

      this.removeActiveTab();
    }
  }
});

var content = new Vue({
  el: "#content",
  data: function() {
    return {
      showDefault: true,
      showAddTab: false,
      showEditTab: false,
      showCitation: false,
      //            refsAvailable: false,
      refs: [],
      activeRef: "",

      editedType: "",
      editedAuthor: "",
      editedTitle: "",
      editedJOB: "",
      editedYear: null,
      editedComment: "",
      MLACitation: "",
      IEEECitation: ""
    };
  },
  computed: {
    activeLibId: function() {
      return sidebar.activeLibId;
    },
    activeRefId: function() {
      if (this.activeRef === null || this.activeRef === "") return null;

      return Number(this.activeRef.slice(4, this.activeRef.length));
    }
  },
  methods: {
    setDefaultContent: function() {
      //show default tab
      this.showDefault = true;
      this.showAddTab = false;
      this.showEditTab = false;
      this.showCitation = false;
    },
    addRef: function() {
      if (this.activeLibId === null || this.activeLibId < 1) return;

      //show tab
      this.showDefault = false;
      this.showAddTab = true;
      this.showEditTab = false;
      this.showCitation = false;
    },
    removeActiveRef: function() {
      if (this.activeRef === "" || this.activeRef === null) return;

      //reset active ref class
      let resetRef = document.getElementById(this.activeRef);
      if (resetRef !== null) {
        resetRef.classList.remove("active");
      }

      //reset the value of activeRef
      this.activeRef = "";
    },
    activateRef: function(ref_id) {
      this.removeActiveRef();

      this.activeRef = ref_id;
      let activeTr = document.getElementById(ref_id);
      if (activeTr !== null) activeTr.classList.add("active");
    },
    getRefInfo: function(ref_id) {
      let ref = document.getElementById(ref_id);

      if (ref === null) return;

      this.editedType = ref.querySelector(".type").textContent;
      this.editedAuthor = ref.querySelector(".author").textContent;
      this.editedTitle = ref.querySelector(".title").textContent;
      this.editedJOB = ref.querySelector(".j-or-b").textContent;
      this.editedYear = ref.querySelector(".year").textContent;
      this.editedComment = ref.querySelector(".comment").textContent;
    },
    editRef: function() {
      if (this.activeRef === null || this.activeRef === "") return;
      //get info of the ref to be edited
      this.getRefInfo(this.activeRef);

      //show edit-tab
      this.showDefault = false;
      this.showAddTab = false;
      this.showEditTab = true;
      this.showCitation = false;
    },
    deleteRef: function() {
      if (this.activeRef === "" || this.activeRef === null) return;

      let deleteForm = document.getElementById("delete-ref");
      deleteForm.submit();
    },
    isEmpty: function(str) {
      return str === null || str === "";
    },
    IEEETemplates: function() {
      if (this.editedType === "article") {
        return (
          this.editedAuthor +
          ', "' +
          this.editedTitle +
          '," ' +
          this.editedJOB +
          ", " +
          this.editedYear +
          "."
        );
      } else if (this.editedType === "inproceedings") {
        return (
          this.editedAuthor +
          ". (" +
          this.editedYear +
          "). " +
          this.editedTitle +
          ". Presented at " +
          this.editedJOB +
          "."
        );
      }
    },
    MLATemplates: function() {
      if (this.editedType === "article") {
        return (
          this.editedAuthor +
          '. "' +
          this.editedTitle +
          '." ' +
          this.editedJOB +
          "(" +
          this.editedYear +
          ")"
        );
      } else if (this.editedType === "inproceedings") {
        return (
          this.editedAuthor +
          '. "' +
          this.editedTitle +
          '." ' +
          this.editedJOB +
          ", " +
          this.editedYear +
          ". "
        );
      }
    },
    getRefCitation: function() {
      //check active ref
      if (this.activeRef === "" || this.activeRef === null) return;
      //get info
      this.getRefInfo(this.activeRef);
      //check no empty info
      if (
        this.isEmpty(this.editedType) ||
        this.isEmpty(this.editedAuthor) ||
        this.isEmpty(this.editedTitle) ||
        this.isEmpty(this.editedJOB) ||
        this.isEmpty(this.editedYear)
      ) {
        alert("信息缺失, 无法生成引用信息！");
        return;
      }
      //get citation
      this.MLACitation = this.MLATemplates();
      this.IEEECitation = this.IEEETemplates();
      //show tab
      this.showDefault = false;
      this.showAddTab = false;
      this.showEditTab = false;
      this.showCitation = true;
    }
  }
});
