$(function() {

    var heng_idx = 0; //横向id
    var shu_idx = 0; //竖向id
    var schoolId; //学校id
    var shu_total; // 竖向总数
    var heng_total; //横向总数
    var pageSize = 16; //每页数量
    var serverUrl = "json/"; //请求地址


    // 获取学校ID
    $.ajax({
        type: 'GET',
        url: serverUrl + 'init.json',
        success: function(res) {
            if (res.status == '0') {
                schoolId = res.data.schoolId;
            }
        }
    });

    // 获取学校数据
    $.ajax({
        type: 'GET',
        url: serverUrl + 'school.json',
        success: function(res) {
            if (res.status == '0') {
                var str = '';
                for (var i = 0; i < res.data.length; i++) {
                    str += '<option data-id="' + res.data[i].id + '">' + res.data[i].name + '</option>'
                }
                $("#school-list").append(str);
            }
        }
    });

    // 获取页数
    $.ajax({
        type: 'GET',
        url: serverUrl + 'data.json',
        success: function(res) {
            if (res.status == '0') {
                var str = '';
                for (var i = 0; i < res.schoolList.length; i++) {
                    str += '<div class="item clearfix"></div>';
                }
                $("#heng .carousel-inner").append(str);
                $("#heng .carousel-inner .item").eq(0).addClass('active');
            }
        }
    });

    // 获取数据
    function getData(heng_idx, shu_idx) {
        $.ajax({
            type: 'GET',
            url: serverUrl + 'data.json',
            success: function(res) {
                if (res.status == '0') {
                    var str = "";
                    var medal = "";
                    var data = res.schoolList[heng_idx].data;
                    var start = pageSize * shu_idx;
                    var end = pageSize + pageSize * shu_idx;
                    shu_total = data.length;
                    heng_total = res.schoolList.length;

                    if (heng_total > 1) {
                        $("#heng .right").show();
                    }
                    if (heng_idx >= heng_total - 1) {
                        $("#heng .right").hide();
                    }
                    if (heng_idx >= 1) {
                        $("#heng .left").show();
                    }
                    if (heng_idx == 0) {
                        $("#heng .left").hide();
                    }
                    if (shu_idx == parseInt(shu_total / pageSize)) {
                        end = shu_total;
                    }


                    if (parseInt(shu_total / pageSize) > 1) {
                        $("#heng .down").show();
                    }
                    if (shu_idx >= 1) {
                        $("#heng .up").show();
                    }
                    if (shu_idx == 0) {
                        $("#heng .up").hide();
                    }
                    if (shu_idx >= parseInt(shu_total / pageSize)) {
                        $("#heng .down").hide();
                    }

                    console.log(`start:${start}, end:${end}`)
                    console.log(`heng_idx:${heng_idx}, shu_idx:${shu_idx}`)

                    if (res.schoolList[heng_idx].id == schoolId) {
                        $("#sign-btn").find('button').addClass('btn-primary').removeClass('btn-default');
                    } else {
                        $("#sign-btn").find('button').addClass('btn-default').removeClass('btn-primary');
                    }


                    for (var j = start; j < end; j++) {
                        if (data[j] && data[j].isShow) {
                            if (data[j].num == '1') {
                                medal = '<div class="gift"></div></div>'
                            } else if (data[j].num == '2') {
                                medal = '<div class="gift"></div><div class="gift"></div>'
                            } else {
                                medal = '<div class="gift"></div><div class="gift"></div><div>...</div>'
                            }
                            str += '<div class="card-box active" data-id="' + data[j].id + '">' +
                                '<div class="side-front">' +
                                '<img class="bg" src="img/head.jpg" />' +
                                '<div class="xz-box">' + medal + '</div>' +
                                '</div>' +
                                '</div>'
                        } else {
                            str += '<div class="card-box" data-id="' + data[j].id + '">' +
                                '<div class="side-front">' +
                                '<img class="bg" src="img/front.jpg" />' +
                                '</div>' +
                                '<div class="side-back">' +
                                '<img class="bg" src="img/back.jpg" />' +
                                '</div>' +
                                '</div>';
                        }
                    }
                    $("#school-list").val(res.schoolList[heng_idx].name)
                    $("#heng .carousel-inner .item").eq(heng_idx).addClass('active').siblings().removeClass('active');
                    $("#heng .carousel-inner .item").eq(heng_idx).html(str);
                }
            }
        });
    }

    // 初始化获取数据
    getData(heng_idx, shu_idx);

    // 点击向右切换
    $("#heng").on('click', '.right', function() {
        heng_idx++;
        shu_idx = 0;
        if (heng_idx >= heng_total) return false;
        getData(heng_idx, shu_idx);
    });

    // 点击向左切换
    $("#heng").on('click', '.left', function() {
        if (heng_idx <= 0) return false;
        heng_idx--;
        shu_idx = 0;
        getData(heng_idx, shu_idx);
    });

    // 点击向下切换
    $("#heng").on('click', '.down', function() {
        if (shu_idx >= parseInt(shu_total / pageSize)) return false;
        shu_idx++;
        getData(heng_idx, shu_idx);
    });

    // 点击向上切换
    $("#heng").on('click', '.up', function() {
        if (shu_idx <= 0) return false;
        shu_idx--;
        getData(heng_idx, shu_idx);
    });

    // 选择学校
    $("#school-list").on('change', function() {
        var id = $(this).find("option:selected").attr('data-id');
        heng_idx = id;
        getData(heng_idx, shu_idx)
    });

    // 点击翻牌
    $(document).on("click", '.card-box', function() {
        if ($(this).hasClass('active')) return false;

        var that = $(this)
        that.addClass('side-back').siblings().removeClass('side-back');
        setTimeout(function() {
            that.removeClass('side-back');
        }, 1000);

        // 点击签到
        $("#sign-btn").on('click', '.btn-primary', function() {
            var idx = that.attr('data-id');
            $.ajax({
                type: 'GET',
                url: serverUrl + 'data.json',
                success: function(res) {
                    if (res.status == '0') {
                        var str = "";
                        var medal = "";
                        var data = res.schoolList[heng_idx].data;
                        var start = pageSize * shu_idx;
                        var end = pageSize + pageSize * shu_idx;
                        shu_total = data.length;
                        if (shu_idx == parseInt(shu_total / pageSize)) {
                            end = shu_total;
                        }
                        for (var j = start; j < end; j++) {
                            if (data[j] && data[j].isShow) {

                                if (data[j].num == '1') {
                                    medal = '<div class="gift"></div></div>'
                                } else if (data[j].num == '2') {
                                    medal = '<div class="gift"></div><div class="gift"></div>'
                                } else {
                                    medal = '<div class="gift"></div><div class="gift"></div><div>...</div>'
                                }


                                str += '<div class="card-box active" data-id="' + data[j].id + '">' +
                                    '<div class="side-front">' +
                                    '<img class="bg" src="img/head.jpg" />' +
                                    '<div class="xz-box">' + medal + '</div>' +
                                    '</div>' +
                                    '</div>'
                            } else {
                                if (data[j].id == idx) {
                                    str += '<div class="card-box active" data-id="' + data[j].id + '">' +
                                        '<div class="side-front">' +
                                        '<img class="bg" src="img/head.jpg" />' +
                                        '<div class="xz-box"><div class="gift"></div></div>' +
                                        '</div>' +
                                        '</div>'
                                } else {
                                    str += '<div class="card-box" data-id="' + data[j].id + '">' +
                                        '<div class="side-front">' +
                                        '<img class="bg" src="img/front.jpg" />' +
                                        '</div>' +
                                        '<div class="side-back">' +
                                        '<img class="bg" src="img/back.jpg" />' +
                                        '</div>' +
                                        '</div>';
                                }
                            }
                        }
                        $("#heng .carousel-inner .item").eq(heng_idx).html(str);
                    }
                }
            });
        });
    });
})