"use strict";
var KTSessionTimeoutDemo = function () {

    var initDemo = function () {
        $.sessionTimeout({
            title: 'KingWolf Bank thông báo',
            message: 'Thời gian truy cập website của bạn đã quá thời gian',
            logoutUrl: 'http://localhost:3000/dangxuat',
            warnAfter: 300000, //warn after 5 phút
            redirAfter: 330000, //redirect after 10 secons,
            ignoreUserActivity: true,
            countdownMessage: 'Redirecting in {timer} seconds.',
            countdownBar: true
        });
    }

    return {
        //main function to initiate the module
        init: function () {
            initDemo();
        }
    };

}();

jQuery(document).ready(function() {    
    KTSessionTimeoutDemo.init();
});