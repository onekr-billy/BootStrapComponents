
(function ($) {

    var requireCache = {};

    $.require = function (url, async) {

        var resultScript = requireCache[url];

        var async = typeof (async) === 'undefined' ? false : true;

        if (typeof (resultScript) == 'undefined') {
            $.ajax({
                url: url,
                dateType: 'script',
                async: async,
                success: function (script) {
                    resultScript = script;
                    requireCache[url] = resultScript;
                }
            });
        } else {
            var fun = new Function(resultScript);
            fun.call();
        }
    };

    window.define = function (script) {
        return script.call();
    };

})(jQuery);

window.bootstrap = {};

(function (bootstrap, panel) {

    var panelTpl = [].join("");
    var $panellist = $("#panel-list");
    var panelCache = {};

    panel.load = function (control, action) {

        var resulthtml;
        var viewPath = panel.getViewPath(control, action);
        $.ajax({
            url: viewPath,
            type: 'get',
            dataType: 'html',
            async: false,
            success: function (html) {
                resulthtml = html;
            }
        })
        return resulthtml;
    };

    panel.getViewPath = function (control, action) {
        return ["/scripts", "pages", "view", control, action + ".html"].join("/");
    };

    panel.resetAcrive = function () {
        $panellist.find("div.page-content").hide();
    };

    panel.add = function (text, control, action) {

        var panelId = control + "-" + action;
        $panelItem = $("<div></div>").attr({
            "id": panelId,
            "class": "page-content"
        }).html(panel.load(control, action));
        $panellist.append($panelItem);

        return $panelItem;

    };

    panel.active = function (text, control, action) {

        var panelId = control + "-" + action;
        var $panelItem = $panellist.find("div#" + panelId);
        if ($panelItem.length <= 0) {
            $panelItem = panel.add(text, control, action);
        }
        panel.resetAcrive();
        $panelItem.fadeIn();

    };

    panel.remove = function (control, action) {

        var id = control + "-" + action;
        $("#" + id).fadeOut(200, function () {
            $(this).remove();
        });
    };


})(bootstrap, bootstrap.panel = {});

(function (bootstrap, nav) {

    var navTpl = ['<li data-control="{1}" data-action="{2}" ><a href="#">', '<i class="icon-chevron-right"></i>{0}</a></li>'].join('');
    var $navlist = $("#nav-list");
    var navCache = {};

    nav.getTpl = function (text, control, action) {
        return $(navTpl.replace("{0}", text).replace("{1}", control).replace("{2}", action));
    };

    nav.getConollerPath = function (control, action) {
        return ["/scripts", "pages", "controller", control, action + ".js"].join("/");
    };

    nav.resetAcrive = function () {
        $navlist.find("li.active").eq(1).removeClass("active");
    };

    nav.resetNavState = function () {
        if ($navlist.find("li[class!='last']").eq(1).length > 0) {
            $navlist.find("li.last").hide();
        } else {
            $navlist.find("li.last").show();
        }
    };

    nav.getController = function (control, action) {
        var controlPath = nav.getConollerPath(control, action);
        $.require(controlPath);
    };

    nav.add = function (text, control, action) {

        var routerItem = nav.getTpl(text, control, action);
        $navlist.append(routerItem);

        routerItem.on("click", function () {
            var $this = $(this);
            var text = $this.find("a").text();
            var control = $this.attr("data-control");
            var action = $this.attr("data-action");
            nav.active(text, control, action);
        });
        routerItem.find("a i").on("click", function () {
            nav.remove($(this).parents("li"));
        });

        return routerItem;

    };

    nav.remove = function (item) {
        var control = item.attr("data-control");
        var action = item.attr("data-action");
        item.animate({
            opacity: 0,
            marginLeft: '-=140px'
        }, 300, function () {
            $(this).remove();
            nav.resetNavState();
            bootstrap.panel.remove(control, action);
            $navlist.find("li[class!='last']").eq(1).first().click()
        });
    };

    nav.active = function (text, control, action) {

        var routerItem = $navlist.find("li[data-control='" + control + "'][data-action='" + action + "']");

        if (routerItem.length <= 0) {
            routerItem = nav.add(text, control, action);
        }
        nav.resetAcrive();
        nav.resetNavState();
        routerItem.addClass("active");

        bootstrap.panel.active(text, control, action);
        nav.getController(control, action);
    };

})(bootstrap, bootstrap.nav = {});

(function (bootstrap, msg) {

    msg.ERROR = { val: -1, cls: 'alert-error', title: '错误信息' };
    msg.SUCCESS = { val: 1, cls: 'alert-success', title: '成功信息' };
    msg.WARNING = { val: 2, cls: 'alert-block', title: '警告信息' };
    msg.INFO = { val: 3, cls: 'alert-info', title: '信息' };

    var getTpl = function (txt, msgType, options) {

        var msgTpl = ['<div '
                    , 'style="opacity:' + options.opacity + '; filter: alpha(opacity=' + options.opacity + ');" '
                    , 'class="alert ' + msgType.cls + '">'
                    , '<a class="close" data-dismiss="alert">×</a>'
                    , options.showTitle ? '<h5 class="alert-heading">' + msgType.title + '</h5>' : ""
                    , txt
                    , '</div>'].join("");

        return $(msgTpl);

    };

    var getContainer = function () {

        var msgContainer = $("#msg-container");
        if (msgContainer.length <= 0)
            msgContainer = $(document.body);

        return msgContainer;

    };

    var DEFOPTIONS = {
        hideTimtout: NaN,
        showTitle: false,
        opacity: 1.0
    };

    msg.show = function (txt, msgType, options) {

        options = $.extend(DEFOPTIONS, options);

        if (typeof (options) == "number")
            DEFOPTIONS.hideTimtout = options;

        if (typeof (msgType) !== "object" || typeof (msgType.val) !== "number")
            msgType = msg.INFO;

        var tpl = getTpl(txt, msgType, options);
        var container = getContainer();
        if (container[0].tagName == 'BODY') {
            tpl.addClass("msg");
        }
        container.append(tpl);

        if (typeof (options.hideTimtout) === "number" && !isNaN(options.hideTimtout)) {
            setTimeout(function () {
                tpl.animate({
                    opacity: 0,
                    top: "-=70"
                }, 600, function () {
                    $(this).remove();
                });
            }, options.hideTimtout);
        }

    };


})(bootstrap, bootstrap.msg = {});

(function (bootstrap, progress) {

    progress.DEFAULT = { val: 0, cls: '', title: '' };
    progress.ERROR = { val: -1, cls: 'progress-danger', title: '' };
    progress.SUCCESS = { val: 1, cls: 'progress-success', title: '' };
    progress.WARNING = { val: 2, cls: 'progress-warning', title: '' };
    progress.INFO = { val: 3, cls: 'progress-info', title: '' };

    var getTpl = function (progressId, showType, valTxt) {

        var tpl = ['<div '
                , 'id="' + progressId + '"'
                , 'class="progress ' + showType.cls + ' progress-striped active">'
                , '<div class="bar" >'
                //, valTxt ? valTxt : ""
                , '</div></div>'].join("");

        return tpl;
    };

    progress.add = function (containerId, progressId, showType) {

        var container = $("#" + containerId);
        var progress = $("#" + progressId);

        if (container.length > 0 && progress.length == 0) {
            if (typeof (showType) == "undefined")
                showType = bootstrap.progress.DEFAULT;

            var tpl = getTpl(progressId, showType);

            container.append(tpl);
        }

    };

    progress.setVal = function (progressId, val) {

        // val = 百分比
        var container = $("#" + progressId);
        if (container.length > 0 && typeof (val) == "number" && val >= 0 && val <= 100) {
            var progressObj = container.find(".bar");
            var valTxt = val + "%";
            progressObj.css({ width: valTxt }).data("val", val);
            progressObj.text(valTxt);
            return true;
        } else
            return false;

    };

    progress.getVal = function (progressId) {

        var container = $("#" + progressId);
        if (container.length > 0) {
            var progressObj = container.find(".bar");
            return progressObj.data("val");
        }

    };

    progress.getShowType = function (progressId, showType) {
        var container = $("#" + progressId);
        if (container.length > 0 && typeof (showType) != "undefined") {

            var clsArray = [
                progress.DEFAULT.cls,
                progress.ERROR.cls,
                progress.SUCCESS.cls,
                progress.WARNING.cls,
                progress.INFO.cls
            ];

            for (var i = 0; i < clsArray.length; i++)
                container.removeClass(clsArray[i]);

            container.addClass(showType.cls);
        }
    };


})(bootstrap, bootstrap.progress = {});

(function (bootstrap, grid) {

    var getTpl = function (gridId, options) {

        var gridHeadTpl = function () {

            var gridHead = [];
            $.each(options.columns, function (i, item) {
                if (item.dataType == "checkbox")
                    gridHead.push('<th style="text-align:center;" data-index="' + item.dataIndex + '"><input type="checkbox" class="checkall" /></th>');
                else
                    gridHead.push('<th data-index="' + item.dataIndex + '">' + item.head + '</th>');
            });

            var tpl = ['<thead>'
                    , '<tr >'
                    , gridHead.join("")
                    , '</tr>'
                    , '</thead>'].join('');

            return tpl;

        };

        var gridTpl = ['<div id="' + gridId + '" ><table class="table table-bordered table-striped table-hover">'
                        , gridHeadTpl()
                        , '<tbody>'
                        , '</tbody>'
                        , '</table><div class="pagination pagination-right"></div></div>'].join("");

        return gridTpl;

    };

    var gridPagingTpl = function (gridId, page, size, total) {

        var gridObj = $("#" + gridId);

        var changePageFun = function (page) {
            return [' onclick="bootstrap.grid.changepage(\'' + gridId + '\','
            , page
            , ','
            , size
            , ');" '].join("");
        };

        var isEnablePrev = page > 1;
        var pagingPrev = ['<li class="'
            , isEnablePrev ? '' : 'disabled'
            , '" ><a '
            , isEnablePrev ? changePageFun(page - 1) : ""
            , ' href="javascript:;">Prev</a></li>'].join("");

        var isEnableNext = page <= (total / size);
        var pagingNext = ['<li class="'
            , isEnableNext ? '' : 'disabled'
            , '" ><a '
            , isEnableNext ? changePageFun(page + 1) : ""
            , ' href="javascript:;">Next</a></li>'].join("");

        var pagingItems = [];

        for (var i = 1; i <= Math.ceil(total / size) ; i++) {
            if (i == page)
                pagingItems.push('<li class="active"><a href="javascript:;">' + i + '</a></li>');
            else
                pagingItems.push(['<li><a onclick="bootstrap.grid.changepage(\'' + gridId + '\','
            , i
            , ','
            , size
            , ');" href="javascript:;">'
            , i
            , '</a></li>'].join(""));
        }

        var tpl = ['<ul>'
                    , pagingPrev
                    , pagingItems.join("")
                    , pagingNext
                    , '</ul>'].join("");

        gridObj.find("div.pagination").html(tpl);

    };

    var DEFOPTIONS = {
        url: null,
        size: 3,
        data: {},
        columns: [],
        showCheckbox: true,
        showPaging: true
    };
    var gridOptions = {};

    grid.changepage = function (gridId, page) {

        var gridBody = [];
        var options = gridOptions[gridId];

        if (typeof (options) == 'undefined') return;

        var bingData = function (gridId, options, page, data) {

            var gridObj = $("#" + gridId);

            if (typeof (data) == "object" && $.isArray(data.list)) {

                gridPagingTpl(gridId, page, options.size, data.total);

                $.each(data.list, function (i, listItem) {

                    var rowData = [];
                    rowData.push('<tr>');
                    $.each(options.columns, function (i, colItem) {
                        if (typeof (colItem.format) == "function") {
                            rowData.push('<td>' + colItem.format(colItem, listItem) + '</td>');
                        }
                        else {
                            if (colItem.dataType == "checkbox") {
                                var checkVal = listItem[colItem.checkVal];
                                if (checkVal)
                                    rowData.push('<td style="text-align:center;"><input class="_id" type="checkbox" checked="checked" value="' + listItem[colItem.dataIndex] + '" /></td>');
                                else
                                    rowData.push('<td style="text-align:center;"><input class="_id" type="checkbox" value="' + listItem[colItem.dataIndex] + '" /></td>');
                            } else {
                                rowData.push('<td>' + listItem[colItem.dataIndex] + '</td>');
                            }
                        }

                    });
                    rowData.push('</tr>');

                    gridBody.push(rowData.join(""));
                });
            }

            gridObj.find("tbody").html(gridBody.join(""));

            grid.checkState(gridId);
            grid.checkBind(gridId);
        };

        var data = {};

        if (typeof (options.data) != "undefined" && $.isArray(options.data.list)) {
            bingData(gridId, options, page, options.data);
        } else if (typeof (options.url) == "string" && options.url.length > 0) {
            $.ajax({
                url: options.url,
                //async: false,
                dataType: 'json',
                data: { page: page, size: options.size },
                success: function (jdata) {
                    if (jdata.success)
                        bingData(gridId, options, page, jdata);
                }

            });
        }
    };

    grid.checkState = function (gridId) {

        var gridObj = $("#" + gridId);
        var checkboxAll = gridObj.find(".checkall");
        var gridRows = gridObj.find("tbody > tr");
        var itemCheckboxList = gridObj.find("input._id[type='checkbox']:checked");
        if (itemCheckboxList.length == gridRows.length)
            checkboxAll.attr("checked", true);
        else
            checkboxAll.removeAttr("checked");

    };

    grid.checkBind = function (gridId) {
        var gridObj = $("#" + gridId);
        gridObj.find("input._id[type='checkbox']").unbind().on("change", function () {
            grid.checkState(gridId);
        });
        gridObj.find(".checkall").unbind().on("change", function () {
            if (this.checked) {
                gridObj.find("input._id[type='checkbox']").attr("checked", true);
            } else {
                gridObj.find("input._id[type='checkbox']").removeAttr("checked");
            }
        });
    };

    grid.init = function (containerId, gridId, options) {

        options = $.extend(DEFOPTIONS, options);

        var container = $("#" + containerId);
        var gridObj = $("#" + gridId);
        gridOptions[gridId] = options;

        if (container.length > 0 && gridObj.length == 0) {
            setTimeout(function () {
                var tpl = getTpl(gridId, options);
                container.append(tpl);
                grid.changepage(gridId, 1);
            }, 200);
        }
    };

    grid.getSelectIds = function (gridId) {
        var gridObj = $("#" + gridId);
        var itemCheckboxList = gridObj.find("input._id[type='checkbox']:checked");
        var ids = [];
        $.each(itemCheckboxList, function () {
            var val = parseInt($(this).val());
            if (typeof (val) === 'number' && !isNaN(val))
                ids.push(val);
        });
        return ids;
    };

})(bootstrap, bootstrap.grid = {});

(function (bootstrap, modal) {

    var getTpl = function (modalId, options) {

        var title = options.title,
            content = options.content,
            buttons = options.buttons,
            url = options.url;

        if ((content || "").length == 0 && (url || "").length > 0) {
            $.ajax({
                url: url,
                type: 'get',
                dataType: 'html',
                async: false,
                success: function (html) {
                    content = html;
                }
            });
        }

        return ['<div  class="modal hide fade" id="' + modalId + '">'
                , '<div class="modal-header">'
                , '<a class="close" data-dismiss="modal">×</a><h4>'
                , title
                , '</h4></div>'
                , '<div class="modal-body">'
                , content,
                , '</div><div class="modal-footer">'
                , buttons.join("")
                , '</div></div>'].join("");

    };

    var DEFOPTIONS = {
        backdrop: true,
        show: false,
        keyboard: true,
        url: '',
        title: '',
        content: '',
        buttons: []
    };

    var modalId = "bootstrapModal";

    modal.hide = function (isRemove) {
        var modalObj = $("#" + modalId);
        modalObj.modal("hide");
        if (isRemove) {
            setTimeout(function () {
                modalObj.remove();
            }, 200);
        }
    };

    modal.show = function (options) {

        if ($("#" + modalId).length <= 0) {
            options = $.extend(DEFOPTIONS, options);

            var tpl = getTpl(modalId, options);
            $(document.body).append(tpl);

            $("#" + modalId).modal({
                backdrop: options.backdrop,
                keyboard: options.keyboard,
                show: options.show
            });
        }
        $("#" + modalId).modal("show");

    };

})(bootstrap, bootstrap.modal = {});