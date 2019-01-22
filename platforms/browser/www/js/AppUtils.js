
var SiteUtils = SiteUtils || (function ($) {
    'use strict';
    var $dialog;

    function dialogContent(msg) {
        //var imgPath = "/" + location.pathname.split('/')[1] + "/loader/img/Ajoor1.png";
        $dialog = $('<div id="educ8eLoader" style="display:block" class="loadmodal disableButton">' +
                  '<div class="modalInner">' +
                  '<div id="loadingMessage" class="cssload-loader">' +
                  '<img src="img/Ajoor1.png" alt=""><p>' + msg + '</p></div>' +
                  '</div></div>');

        return $dialog;
    }

    var utilsFunc = {

        loading: function (message) { //Show Loading Icon
            if (typeof message === 'undefined') {
                message = 'Loading....';
            }

            dialogContent(message).appendTo('body');
        },
        loadingOff: function () {
            $('body').find($("#educ8eLoader")).remove();
        },
    }


    return utilsFunc;



})(jQuery);