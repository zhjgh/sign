$(function() {

    var heng_idx = 0;
    var shu_idx = 0;
    var schoolId;
    var total;
    var pageSize = 16;
    var isSelected = false;
    var serverUrl = "https://zhjgh.github.io/sign/";

    $.ajax({
        type: 'GET',
        url: serverUrl + 'init.json',
        success: function(res) {
            if (res.status == '0') {
                schoolId = res.data.schoolId;
            }
        }
    });


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

    function getData(heng_idx, shu_idx) {
        $.ajax({
            type: 'GET',
            url: serverUrl + 'data.json',
            success: function(res) {
                if (res.status == '0') {
                    var str = "";
                    var data = res.schoolList[heng_idx].data;
                    var start = pageSize * shu_idx;
                    var end = pageSize + pageSize * shu_idx;
                    total = data.length;
                    if (shu_idx == parseInt(total / pageSize)) {
                        end = total;
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
                            str += '<div class="card-box active" data-id="' + data[j].id + '">' +
                                '<div class="side-front">' +
                                '<img src="img/head.jpg" />' +
                                '</div>' +
                                '</div>'
                        } else {
                            str += '<div class="card-box" data-id="' + data[j].id + '">' +
                                '<div class="side-front">' +
                                '<img src="img/front.jpg" />' +
                                '</div>' +
                                '<div class="side-back">' +
                                '<img src="img/back.jpg" />' +
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

    getData(heng_idx, shu_idx);

    $("#heng").on('click', '.right', function() {
        if (heng_idx >= $("#heng .carousel-inner .item").length - 1) return false;
        heng_idx++;
        shu_idx = 0;
        getData(heng_idx, shu_idx);
    });

    $("#heng").on('click', '.left', function() {
        if (heng_idx <= 0) return false;
        heng_idx--;
        shu_idx = 0;
        getData(heng_idx, shu_idx);
    });

    $("#heng").on('click', '.down', function() {
        if (shu_idx >= parseInt(total / pageSize)) return false;
        shu_idx++;
        getData(heng_idx, shu_idx);
    });

    $("#heng").on('click', '.up', function() {
        if (shu_idx <= 0) return false;
        shu_idx--;
        getData(heng_idx, shu_idx);
    });


    $("#school-list").on('change', function() {
        var id = $(this).find("option:selected").attr('data-id');
        heng_idx = id;
        getData(heng_idx, shu_idx)
    });

    $(document).on("click", '.card-box', function() {
        var that = $(this)
        if (!isSelected) {
            isSelected = true;
            that.addClass('side-back').siblings().removeClass('side-back');
            setTimeout(function() {
                $(".card-box").removeClass('side-back');
                isSelected = false;
            }, 1000)
        }
        $("#sign-btn").on('click', '.btn-primary', function() {
            if (isSelected) {
                var idx = that.attr('data-id');
                $.ajax({
                    type: 'GET',
                    url: serverUrl + 'data.json',
                    success: function(res) {
                        if (res.status == '0') {
                            var str = "";
                            var data = res.schoolList[heng_idx].data;
                            var start = pageSize * shu_idx;
                            var end = pageSize + pageSize * shu_idx;
                            total = data.length;
                            if (shu_idx == parseInt(total / pageSize)) {
                                end = total;
                            }
                            for (var j = start; j < end; j++) {
                                if (data[j] && data[j].isShow) {
                                    str += '<div class="card-box active" data-id="' + data[j].id + '">' +
                                        '<div class="side-front">' +
                                        '<img src="img/head.jpg" />' +
                                        '</div>' +
                                        '</div>'
                                } else {
                                    if (data[j].id == idx) {
                                        str += '<div class="card-box active" data-id="' + data[j].id + '">' +
                                            '<div class="side-front">' +
                                            '<img src="img/head.jpg" />' +
                                            '</div>' +
                                            '</div>'
                                    } else {
                                        str += '<div class="card-box" data-id="' + data[j].id + '">' +
                                            '<div class="side-front">' +
                                            '<img src="img/front.jpg" />' +
                                            '</div>' +
                                            '<div class="side-back">' +
                                            '<img src="img/back.jpg" />' +
                                            '</div>' +
                                            '</div>';
                                    }
                                }
                            }
                            $("#heng .carousel-inner .item").eq(heng_idx).html(str);
                        }
                    }
                });
            }
        });
    });
})