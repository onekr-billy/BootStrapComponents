
$(document).ready(function () {

    $('body').off('.data-api');
    $('body').off('.alert.data-api');

    $(".router-action").on("click", function (e) {
        var me = $(this);

        var dataRouterSplit = me.attr("data-router").split("-");
        var control, action;
        if (dataRouterSplit.length > 0) {
            control = dataRouterSplit[0];
            action = dataRouterSplit[1];
        } else {
            control = "console";
            action = "index";
        }

        var text = me.text();

        bootstrap.nav.active(text, control, action)

        me.parents("li.dropdown").removeClass("open");

        try {
            e.stopPropagation();//阻止时间冒泡
            e.preventDefault();//阻止默认行为
        } catch (e) {

        }
        return false;
    });

    $(".router-action[data-router='task-execution']").click();


});