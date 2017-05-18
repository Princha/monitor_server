function OnPageLoad(params) {
    UpdateInterfaceStatus(params.interfaces);
    UpdateVersionStatus(params.device || {});
}

function tableLine(clazz, name, value) {
    return '<dt><label class="label">' + name + ':</label>' +
        ' <label class="value">' + value + '</label></dt>\n';
}

function UpdateInterfaceStatus(interfaces) {
    interfaces = interfaces || [{ name: "eth0" }];
    var wlan = {};

    for (var i = 0; i < interfaces.length; i++) {
        var iterface = interfaces[i] || {};
        var name = iterface.name || "";
        var label = "";
        if (name.startsWith("eth")) {
            name = "eth_sticky";
            label = "LANStatus";

        } else if (name.startsWith("ppp")) {
            name = "wan_sticky";
            label = "WANStatus";

        } else if (name.startsWith("ra")) {
            name = "wl_sticky";
            label = "WlStatus";

        } else {
            //continue;
        }

        var ipaddr = iterface.ip || "0.0.0.0";
        var netmask = iterface.netmask || "0.0.0.0";
        var macaddr = iterface.mac || "00:00:00:00:00:00"

        var html = '';
        html += '<legend>' + label + '</legend>';
        html += '<dl>';

        html += tableLine("odd", 'NetIPAddress', ipaddr);
        //html += tableLine("odd",  T('NetSubnetMask'), netmask);

        if (iterface.gateway) {
            html += tableLine("even", 'NetGateway', iterface.gateway);

        } else {
            html += tableLine("even", 'NetMACAddress', macaddr);
        }
        //html += tableLine("odd", T('Receive') + "/" + T('Send'), iterface.rx + " / " + iterface.tx);

        if (name == "wl_sticky") {
            var ssid = wlan.ssid || "";
            var address = wlan.address || "00:00:00:00:00:00";
            var quality = wlan.quality || 0;
            var bitrate = wlan.bitrate || 0;
            html += tableLine("even", T('WlESSID'), ssid + ' (' + address + ')');
            html += tableLine("odd", T('WlQuality'), quality + ' (' + bitrate + 'Mb/s)');
        }
        html += '</dl>\n';
        $('#' + name).html(html).show();
    }
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

function UpdateVersionStatus(params) {
    $('#device_version').html(params.device_version || "0.00.000");
    $('#device_model').html(params.device_model || "iNode");
    $('#device_name').html(params.device_name || "iNode");
    $('#device_time').html(params.device_time || "0000-00-00 00:00:00");
    $('#device_memmory').html(params.device_memmory || "");
    $('#device_cpu').html(params.device_cpu || "");
    $('#device_storage').html(params.device_storage || "");
    $('#device_root').html(params.device_root || "");
    $('#device_url').html(params.device_url || "");
    $('#device_time').html(params.device_time || "");
    $('#device_uptime').html(formatUptime(params.device_uptime) || "");

}
const ip = getUrlParam('ip')
var cmd;
$(document).ready(function () {
    // $translate(document.body)
    cmd = {
        "jsonrpc": "2.0",
        "method": "status",
        "id": 1,
        "url": ip + "/app/monitor/webconsole.lua",
        "params": ["NO_LOGIN", { "user": "admin", "hostname": "", "path": "" }, ""]
    }
    const str = JSON.stringify(cmd)
    $.post("/ssh/cmd", { cmd: str, ip: ip }, function (result) {
        console.log(result)
        if (result.code == 1) {
            OnPageLoad(result.result.status || {})
        } else {
        }
    })
})
//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}