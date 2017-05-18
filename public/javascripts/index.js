var socket;
$(document).ready(function () {
    console.log('ready')
    // socket = io.connect('http://localhost:3000');
    // socket.on('news', function (data) {
    //     console.log(data);
    // });
    // $.get("listHosts", function (result) {
    //     if (result.code == 1) {
    //         console.log(result.data)
    //         startMonitor(result.data)
    //     }
    // });
    $.get('/groups/list', function (result) {
        if (result.code == 1) {
            console.log(result.data)
            var group = getCookie('current_group')
            if (group != null) {
                $.get("/group/listHosts",{group_name:group}, function (result) {
                    if (result.code == 1) {
                        console.log(result.data)
                        startMonitor(result.data)
                    }
                });
            } else {
                setCookie('current_group','all')
                $.get("/group/listHosts", {group_name:'all'},function (result) {
                    if (result.code == 1) {
                        console.log(result.data)
                        startMonitor(result.data)
                    }
                });
            }
            updateGroupItem(result.data)
        }
    })
});

function startMonitor(data) {
    $.ajax({
        url: "/group/getStates",
        data: { servers: JSON.stringify(data) },
        type: 'post',
        // traditional: true,
        success: function (data) {
            updateTableItem(data)
        },
        error: function () {
            alert("添加失败，请重新确认数据是否准确");
        }
    });
    var timer = setInterval(function () {
        $.ajax({
            url: "/group/getStates",
            data: { servers: JSON.stringify(data) },
            type: 'post',
            // traditional: true,
            success: function (data) {
                // console.log(data)
                updateTableItem(data)
            },
            error: function () {
                alert("添加失败，请重新确认数据是否准确");
            }
        });
    }, 2000);
}

function allRestart() {
    console.log('allRestart...')
    $.get("allRestart", function (data) {
        console.log(data)
    });
}
function allUpdate() {
    console.log('allUpdate')
    $.get("allUpdate", function (data) {
        console.log(data)
    });
}
function add() {
    console.log('add')
    window.location.href = './add.html'
    // socket.emit('anotherNews',{hello:'hsp'});
}
function addGroup() {
    window.location.href = './addGroup.html'
}

function shell(param) {
    console.log('add')
    window.location.href = './allshell.html?param='+param
    // socket.emit('anotherNews',{hello:'hsp'});
}

function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}