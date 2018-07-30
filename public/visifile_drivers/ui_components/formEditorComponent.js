function component( args ) {
/*
base_component_id("form_editor_component")
load_once_from_file(true)
*/

    //alert(JSON.stringify(args,null,2))
    var uid2 = uuidv4()
    var mm = null
    var texti = args.text
    Vue.component("form_editor_component", {
      data: function () {
        return {
            text: texti,
            uid2: uid2
        }
      },
      template: `<div>Form editor
                    <div v-bind:id='uid2' ></div>
                    <hr />
                     <slot  :text2="text"></slot>
                 </div>`
     ,

     mounted: function() {
         mm = this
         document.getElementById(uid2).style.width="100%"

         document.getElementById(uid2).style.height="45vh"
         var json2 = saveHelper.getValueOfCodeString(texti,"formEditor",")//formEditor")
         alert(JSON.stringify(json2))
         //editor.getSession().setUseWorker(false);


         editor.getSession().on('change', function() {
            //mm.text = editor.getSession().getValue();
            //alert("changed text to : " + mm.text)
            });
     },
     methods: {
        getText: function() {
            return this.text
        },
        setText: function(textValue) {
            this.text =  textValue
            //editor.getSession().setValue(textValue);
            var json2 = saveHelper.getValueOfCodeString(textValue,"formEditor",")//formEditor")
            alert(JSON.stringify(json2))
        }

     }


    })

}
