var hostlist;
var jsonRpcIndex = 0;
var hostPath = '/home/ubuntu';
var terminal
var param
$(document).ready(function () {
    /* First console */
    var console1 = $('.console1');
    // var Ip = getUrlParam('ip')
    var Ip = 'all'
    param = getUrlParam('param')
    if (param == 1) {
        $('#allshell_param').css('display', 'block');
        const cmd = "rm ~/cmd.sh;echo 'cd /tmp/' >> ~/cmd.sh;" +
            "echo 'rm nodelua-linux-sdk.*' >> ~/cmd.sh;" +
            "echo 'rm -R node' >> ~/cmd.sh;" +
            "echo 'wget http://192.168.31.100/nodelua-linux-sdk.zip' >> ~/cmd.sh;" +
            "echo 'mkdir node' >> ~/cmd.sh;" +
            "echo 'unzip nodelua-linux-sdk.zip -d node/' >> ~/cmd.sh;" +
            "echo 'chmod 777 node/install.sh' >> ~/cmd.sh;" +
            "echo 'cd node' >> ~/cmd.sh;" +
            "echo 'sudo ./install.sh' >> ~/cmd.sh;" +
            "sudo chmod 777 ~/cmd.sh;"+
            "sudo ~/cmd.sh"
            $('#allshell_cmd').val(cmd)
        // $('#allshell_param').style.visibility="display";
    }
    // $('body').append(console1);
    const group = getCookie('current_group')
    console.log(group)
    $.get("listHosts", { group_name: group }, function (result) {
        if (result.code == 1) {
            console.log(result.data)
            hostlist = result.data
            updateTableItem(result.data)
        }
    });

    terminal = console1.console({
        promptLabel: Ip + ' > ',
        commandValidate: function (line) {
            if (line == "") return false;
            else return true;
        },
        commandHandle: function (line) {
            console.log(hostlist)
            const strs = line.match(/[a-zA-Z0-9._\/\~]+/g)
            console.log(strs)
            hostlist.forEach(function (element) {
                // console.log(element)
                _updateItem(element.ip, false)
                var cmd;
                jsonRpcIndex++
                if (strs[0] == 'cd') {
                    cmd = {
                        "jsonrpc": "2.0",
                        "method": "cd",
                        "id": jsonRpcIndex,
                        "url": element.ip + "/app/monitor/webconsole.lua",
                        "params": ["NO_LOGIN", { "user": "admin", "hostname": "", "path": hostPath }, strs[1]]
                    }
                } else {
                    cmd = {
                        "jsonrpc": "2.0",
                        "method": "run",
                        "id": 1,
                        "url": element.ip + "/app/monitor/webconsole.lua",
                        "params": ["NO_LOGIN", { "user": "admin", "hostname": "", "path": hostPath }, line]
                    }
                }
                const str = JSON.stringify(cmd)
                run(str, element)
            }, this);
            return ''
        },
        autofocus: true,
        animateScroll: true,
        promptHistory: true,
        charInsertTrigger: function (keycode, line) {
            return true;
        }
    });

});
function onbutton() {
    var line = $('#allshell_cmd').val()
    hostlist.forEach(function (element) {
        // console.log(element)
        _updateItem(element.ip, false)
        if (param == 1) {
            if (element.ip == $("#allshell_server").val()) {
                console.log('find ip same : ' + element.ip)
                return null
            }
        }
        var cmd;
        jsonRpcIndex++
        cmd = {
            "jsonrpc": "2.0",
            "method": "run",
            "id": 1,
            "url": element.ip + "/app/monitor/webconsole.lua",
            "params": ["NO_LOGIN", { "user": "admin", "hostname": "", "path": hostPath }, line]
        }
        const str = JSON.stringify(cmd)
        run(str, element)
    }, this);
}

function run(str, element) {

    $.post("/ssh/cmd", { cmd: str, ip: element.ip }, function (result) {
        if (result.code == 1) {
            _updateItem(element.ip, true)
            if (result.result.environment) {
                hostPath = result.result.environment.path;
            }
            if (result.result.output != null) {
                if (result.result.output.indexOf('Command killed:') > -1 && result.result.output.indexOf('No such file or directory') <-1) {
                    _updateItem(element.ip, true, 'red')
                    terminal.report([{
                        msg: element.ip + ' >>>>>>>>>>>>>>>>>>>',
                        className: "jquery-console-message-label"
                    },
                    ]);
                    terminal.report([{
                        msg: result.result.output,
                        className: "jquery-console-message-error"
                    },
                    ]);
                } else {
                    terminal.report([{
                        msg: element.ip + ' >>>>>>>>>>>>>>>>>>>',
                        className: "jquery-console-message-label"
                    },
                    ]);
                    terminal.report([{
                        msg: result.result.output,
                        className: "jquery-console-message-value"
                    },
                    ]);
                }
            }
        } else {
            _updateItem(element.ip, false)
        }
    })
}
//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

function updateTableItem(items) {
    $("#allshell_table").find("tr:gt(0)").remove();
    items.forEach(function (item) {
        _add(item)
    }, this);

}


function _updateItem(ip, on, color = 'green') {
    if (on) {
        if (color == 'green') {
            $("#" + getHashCode(ip, false)).html("<div id='serviceStateOn'></div>")
        } else {
            $("#" + getHashCode(ip, false)).html("<div id='serviceStateRed'></div>")
        }

    } else {
        $("#" + getHashCode(ip, false)).html("<div id='serviceStateOff'></div>")
    }
    // console.log(td)
}

function _add(item) {
    var online = "<div id='serviceStateOff'></div>"
    // if(item.onLine){
    //     online = "<div id='serviceStateOn'></div>"
    // }else{
    //     online = "<div id='serviceStateOff'></div>"
    // }
    $("#allshell_table > tbody:last-child").append("<tr><td id = '" + getHashCode(item.ip, false) + "'>" + online + "</td> \
        <td class='tdname' align='center' id='host' onclick='_host(this)'>"+ item.name + "</td> \
        <td class='tdip' align='center'>"+ item.ip + "</td> \
       </tr>");
}


/**
02
* 获取字符串的哈希值
03
* @param {String} str
04
* @param {Boolean} caseSensitive
05
* @return {Number} hashCode
06
*/

function getHashCode(str, caseSensitive) {
    if (!caseSensitive) {
        str = str.toLowerCase();
    }
    // 1315423911=b'1001110011001111100011010100111'
    var hash = 1315423911, i, ch;
    for (i = str.length - 1; i >= 0; i--) {
        ch = str.charCodeAt(i);
        hash ^= ((hash << 5) + ch + (hash >> 2));

    }
    return (hash & 0x7FFFFFFF);
}

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
