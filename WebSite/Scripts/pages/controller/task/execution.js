
define(function () {

    bootstrap.grid.init("grid-container", "grid1", {
        //url: 'http://localhost:25667/api/top/shop?format=json',
        url: 'grid-data.json',
        //data: gridData,
        size: 10,
        columns: [
            { head: '选择', dataType: 'checkbox', checkVal: 'ischecked', dataIndex: 'id', format: null },
            { head: 'ID', dataIndex: 'id', format: null },
            { head: '标题', dataIndex: 'title', format: null },
            { head: '创建时间', dataIndex: 'created', format: null },
            { head: '状态', dataIndex: 'state', format: function (column, rowData) { return rowData[column.dataIndex]; } }
        ],
        showCheckbox: true
    });

    $("#btnShowForm").click(function () {
        bootstrap.modal.show({
            title: '测试标题',
            url: 'scripts/pages/view/task/task-detail.html',
            //content: '测试内容<input type="text" />',
            buttons: ['<a href="#" class="btn" data-dismiss="modal">关闭</a>'
                      , '<a href="#" class="btn btn-primary">保存更新</a>']
        });
    });

    $("#btnHideForm").click(function () {
        bootstrap.modal.hide();
    });

    bootstrap.msg.show("信息", bootstrap.msg.ERROR);
    bootstrap.msg.show("信息", bootstrap.msg.SUCCESS);
    bootstrap.msg.show("信息", bootstrap.msg.WARNING);
    bootstrap.msg.show("信息", bootstrap.msg.INFO);

    bootstrap.progress.add("progress-container", "a1");
    var v1 = 0;
    setInterval(function () {
        if (v1 == 20) {
            bootstrap.progress.getShowType("a1", bootstrap.progress.WARNING);
            v1 = 0;
        }
        else {
            bootstrap.progress.getShowType("a1", bootstrap.progress.DEFAULT);
            v1 = 20;
        }
        bootstrap.progress.setVal("a1", v1);
    }, 800);

    bootstrap.progress.add("progress-container", "a2", bootstrap.progress.ERROR);
    var v2 = 0;
    setInterval(function () {
        if (v2 == 40) {
            bootstrap.progress.getShowType("a2", bootstrap.progress.DEFAULT);
            v2 = 20;
        }
        else {
            bootstrap.progress.getShowType("a2", bootstrap.progress.ERROR);
            v2 = 40;
        }
        bootstrap.progress.setVal("a2", v2);
    }, 800);

    bootstrap.progress.add("progress-container", "a3", bootstrap.progress.SUCCESS);
    var v3 = 0;
    setInterval(function () {
        if (v3 == 60) {
            bootstrap.progress.getShowType("a3", bootstrap.progress.ERROR);
            v3 = 40;
        }
        else {
            bootstrap.progress.getShowType("a3", bootstrap.progress.SUCCESS);
            v3 = 60;
        }
        bootstrap.progress.setVal("a3", v3);
    }, 800);

    bootstrap.progress.add("progress-container", "a4", bootstrap.progress.WARNING);
    var v4 = 0;
    setInterval(function () {
        if (v4 == 80) {
            bootstrap.progress.getShowType("a4", bootstrap.progress.SUCCESS);
            v4 = 60;
        }
        else {
            bootstrap.progress.getShowType("a4", bootstrap.progress.WARNING);
            v4 = 80;
        }
        bootstrap.progress.setVal("a4", v4);
    }, 800);

    bootstrap.progress.add("progress-container", "a5", bootstrap.progress.INFO);
    var v5 = 0;
    setInterval(function () {
        if (v5 == 100) {
            bootstrap.progress.getShowType("a5", bootstrap.progress.WARNING);
            v5 = 80;
        }
        else {
            bootstrap.progress.getShowType("a5", bootstrap.progress.INFO);
            v5 = 100;
        }
        bootstrap.progress.setVal("a5", v5);
    }, 800);

});
