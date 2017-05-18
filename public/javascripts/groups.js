function updateGroupItem(items) {
    items.forEach(function (item) {
        _add_group(item)
    }, this);

}

function _onGroup(p) {
    console.log($(p).html())
    // document.cookie='current_group='+$(p).html()
    setCookie('current_group', $(p).html())
    console.log(getCookie('current_group'))
    window.location.reload()
}

function _groupImage(image, index) {
    var group_name = $(image).closest("tr").find("#group_item").html()
    console.log(group_name)
    if (group_name != 'all') {
        switch (index) {
            case 1:
                window.location.href = './editGroup.html?name=' + encodeUTF8(group_name)
                break;
            case 2:

                console.log(group_name)
                $("#dialog-confirm").dialog({
                    resizable: false,
                    height: 200,
                    modal: true,
                    buttons: {
                        "Delete": function () {
                            console.log('delete')
                            $.post("/groups/delete", { name: group_name }, function (data) {
                                console.log(data)
                                location.reload();
                                $(this).dialog("close");
                            });
                        },
                        Cancel: function () {
                            $(this).dialog("close");
                        }
                    }
                });
                break;
        }
    }

}

function _add_group(item) {
    var p = "<p id='group_item' style='cursor:pointer' onclick='_onGroup(this)'>" + item.name + "</p>"
    var current_group = getCookie('current_group')
    if (current_group == null) {

    } else {
        if (current_group == item.name) {
            p = "<p id='group_item' style='cursor:pointer;color:#1E90FF' onclick='_onGroup(this)'>" + item.name + "</p>"
        }
    }
    // $("#groups").append("<div>" + p + "\
    //                 <img src='./images/Edit_000000_25.png' onclick='_groupImage(this,1)'>\
    //                 <img src='./images/Delete_000000_25.png' onclick='_groupImage(this,2)'>\
    //             </div>");



    $("#groups_table > tbody:last-child").append("<tr><td class='group_name'>" + p + "</td> \
        <td><div> \
             <img src='./images/Edit_000000_25.png' onclick='_groupImage(this,1)'>\
            <img src='./images/Delete_000000_25.png' onclick='_groupImage(this,2)'>\
        </div></td></tr>");
}

function encodeUTF8(str){  
var temp = "",rs = "";  
for( var i=0 , len = str.length; i < len; i++ ){  
    temp = str.charCodeAt(i).toString(16);  
    rs  += "\\u"+ new Array(5-temp.length).join("0") + temp;  
}  
return rs;  
}  
function decodeUTF8(str){  
return str.replace(/(\\u)(\w{4}|\w{2})/gi, function($0,$1,$2){  
    return String.fromCharCode(parseInt($2,16));  
});   
}   