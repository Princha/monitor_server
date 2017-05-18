function insertTableItem(item) {
    _add(item)
}

function deleteTableItem(item) {

}

function updateTableItem(items) {
    $("#Table").find("tr:gt(0)").remove();
    items.forEach(function (item) {
        _add(item)
    }, this);

}
function formatUptimePart(part) {
    var value = Math.floor(part)
    if (value < 10) {
        return "0" + value
    } else {
        return value
    }
}

function formatUptime(uptime) {
    if (!uptime) {
        return "-1";

    } else if (uptime < 3600) {
        return formatUptimePart(uptime / 60) + "m " +
            formatUptimePart(uptime % 60) + "s"

    } else if (uptime < 3600 * 24) {
        return formatUptimePart(uptime / 3600) + "h " +
            formatUptimePart((uptime % 3600) / 60) + "m " +
            formatUptimePart(uptime % 60) + "s "

    } else {
        return formatUptimePart(uptime / (3600 * 24)) + "d " +
            formatUptimePart((uptime % (3600 * 24)) / 3600) + "h " +
            formatUptimePart((uptime % 3600) / 60) + "m " +
            formatUptimePart(uptime % 60) + "s "
    }
}
function _image(image, index) {
    // console.log(arguments)
    console.log('_image : ' + index)
    var Ip = $(image).closest("tr").find(".tdip").text()
    var name = $(image).closest("tr").find(".tdname").text()
    console.log(Ip);
    switch (index) {
        case 0:
            // window.location.href = './terminal.html?name='+name+'&ip='+Ip
            window.location.href = 'http://' + Ip + '/app/monitor/console.htm'
            break;
        case 3:
            window.location.href = './edit.html?name=' + name + '&ip=' + Ip
            break;
        case 4:
            $("#dialog-confirm").dialog({
                resizable: false,
                height: 200,
                modal: true,
                buttons: {
                    "Delete": function () {
                        console.log('delete')
                        const current_group = getCookie('current_group')
                        $.get("/group/delete", { group_name: current_group, ip: Ip }, function (data) {
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
function _add(item) {
    var online;
    if (item.onLine) {
        online = "<div id='serviceStateOn'></div>"
    } else {
        online = "<div id='serviceStateOff'></div>"
    }
    $("#Table > tbody:last-child").append("<tr><td>" + online + "</td> \
        <td class='tdname' align='center' id='host' onclick='_host(this)'>"+ item.name + "</td> \
        <td class='tdip' align='center'>"+ item.ip + "</td> \
        <td align='center'>"+ formatUptime(item.RunTime) + "</td> \
        <td align='center'>"+ (item.TotalCPUusagetime / item.TotalCPUtime).toFixed(3) + "</td> \
        <td align='center'>"+ item.TotalCPUusagetime + "</td> \
        <td align='center'>"+ ((item.MemTotal - item.MemFree) / item.MemTotal).toFixed(2) + "</td> \
        <td><div> \
            <img src='./images/Console-25.png' onclick='_image(this,0)'> \
            <img src='./images/Download_000000_25.png' onclick='_image(this,2)'> \
            <img src='./images/Edit_000000_25.png' onclick='_image(this,3)'> \
            <img src='./images/Delete_000000_25.png' onclick='_image(this,4)'> \
        </div></td></tr>");
}

function _host(host) {
    var ip = $(host).closest("tr").find(".tdip").text()
    window.location.href = './host.html?ip=' + ip
}