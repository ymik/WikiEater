(function($) {
    var vidExpiration = 730;	// 365*2 = 2 года
    var sessionExpiration = new Date();
    sessionExpiration.setTime((new Date()).getTime() + 1800000); // 1000 * 60 * 30 = 30 minutes

    var bindAutomaticEvents = function() {
        // Установка автоматических событий
        var $elements = $('a, button, input[type="submit"], input[type="reset"], input[type="button"], input[type="image"]').
                not('.wa-setup-event, .wa-event, a[name]');
        $elements.addClass('wa-event').on('click', function() {
            window.waPostEvent(waGetEventData(this));
        });
    };

    // Рассчитываем все значимые пути страницы для переменной mv
    var getMchView = function() {
        var mv = [];
        var $blocks = $('.wa-block');
        var paths = [];
        for(var bi = 0, count = $blocks.length; bi < count; bi++) {
            var $block = $blocks.eq(bi);
            var $path = $block.parents('.wa-block');
            var pathElements = [($block.data('wa-name') || 'none')];
            $path.each(function() {
                pathElements.unshift($(this).data('wa-name') || 'none');
            });
            paths.push('/' + pathElements.join('/') + '/');
        }
        paths.sort();
        for(var pi = 0, cnt = paths.length; pi < cnt; pi++) {
            if(pi == cnt - 1 || paths[pi + 1].indexOf(paths[pi]) !== 0) {
                mv.push(paths[pi]);
            }
        }
        return mv.join(',');
    };

    var send = function(d, uid) {
        var now = (new Date()).getTime();
        if (d && !d.uid) {
            d.uid = now;
        }
        uid = uid || 'i-' + now;
        var g = $.param(d);
        var img = new Image();
        img.id = uid;
        var waqueue = getWaqueue();
        waqueue[uid] = d;
        $.cookie('waqueue', $.toJSON(waqueue), {expires: sessionExpiration, path: '/', domain: 'all'});
        $(img).load(function() {
            var waqueue = getWaqueue();
            if (waqueue[this.id]) {
                delete waqueue[this.id];
            }
            if ($.isEmptyObject(waqueue)) $.cookie('waqueue', null, {path: '/', domain: 'all'});
            else $.cookie('waqueue', $.toJSON(waqueue), {expires: sessionExpiration, path: '/', domain: 'all'});
        });
        img.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'wa.0cw.ru/?' + g;
        if ($.cookie('wa-debugger') && console) {
            var message = d.event ? 'отправлена информация о событии' : 'отправлена информация о просмотре сраницы';
            if ($.browser.msie) {
                console.log('[WA] ' + message + ': ');
                for (var i in d) {
                    console.log('        ', i, ' => ', d[i]);
                }
            } else {
                console.log('[WA] ' + message + ': ', d);
                var showKeys = d.event ?
                {'event': 1, 'm': 1, 'v1': 1, 'v2': 1, 'v3': 1, 'v4': 1} :
                {'m': 1, 'r': 1, 'ab': 1, 'se': 1, 'sc': 1, 'ru': 1 };
                for (i in showKeys) {
                    if (d[i]) {
                        console.log('        ' + i + ' => ', d[i]);
                    }
                }
            }
        }
    };

    var getWaqueue = function() {
        var waqueue = $.cookie('waqueue');
        if (waqueue) {
            waqueue = $.secureEvalJSON(waqueue);
            if ($.isPlainObject(waqueue) && !$.isEmptyObject(waqueue)) return waqueue;
        }
        return {};
    };

    var eventHandler = function(e) {
        window.waPostEvent(e.data);
    };

    window.waPostEvent = function(eventData) {
        var wa = {
            u: window.wa.u,
            v: window.wa.v,
            sc: window.wa.sc,
            se: window.wa.se,
            pt: window.wa.pt
        };
        $.extend(wa, eventData);
        send(wa);
    };

    var waSetupEvent = function() {
        var $this = $(this);
        var eventsData = $this.data('wa-events');
        if (!$.isArray(eventsData)) {
            eventsData = [eventsData];
        }
        for (var i = 0, cnt = eventsData.length; i < cnt; i++) {
            var currentEventData = eventsData[i];
            if (currentEventData.event == 'now') {
                window.waPostEvent(currentEventData.wa);
            } else {
                $this.bind(currentEventData.event, currentEventData.wa, eventHandler);
            }
            $this.removeClass('wa-setup-event').addClass('wa-event');
        }
    };

    // Идентификатор посетителя
    var visitorId = $.cookie('vid') || $.cookie('wavid'),
            sscnt = 1,
            ssexp = 1;
    if (visitorId) {
        if ($.cookie('sscnt')) {
            if ($.cookie('sscls') && $.cookie('ssexp')) {
                sscnt = parseInt($.cookie('sscnt'));
                ssexp = parseInt($.cookie('ssexp')) + 1;
            } else {
                sscnt = parseInt($.cookie('sscnt')) + 1;
            }
        }
    } else {
        visitorId = Math.round(Date.now() / 1000) + '' + (Math.floor(Math.random() * 89999999) + 10000000);
    }
    $.cookie('wavid', visitorId, {expires: vidExpiration, path: '/', domain: 'all'});
    $.cookie('sscnt', sscnt, {expires: vidExpiration, path: '/', domain: 'all'});
    $.cookie('ssexp', ssexp, {expires: sessionExpiration, path: '/', domain: 'all'});
    $.cookie('sscls', 1, {path: '/', domain: 'all'});

    // смотрим, есть ли у нас не отправленные события
    var waqueue = getWaqueue();
    for (var k in waqueue) {
        send(waqueue[k], k);
    }

    bindAutomaticEvents();


    var wa = {
        u: document.location.href,
        r: document.referrer,
        v: visitorId,
        sc: sscnt,
        se: ssexp
    };
//    var mv = getMchView();
//    if(mv) {
//        wa.mv = mv;
//    }
    if(screen && screen.width && screen.height) {
        wa.scr = screen.width + 'x' + screen.height;
    }
    window.wa = window.wa || {};
    $.extend(window.wa, wa);

    send(window.wa);

    $('.wa-setup-event').each(waSetupEvent);
    $(document).ajaxSuccess(function() {
        bindAutomaticEvents();
        $('.wa-setup-event').each(waSetupEvent);
    });

    // Сообщеаем о том, что счетчик готов
    $(document).trigger('wa-ready');

    window.waGetEventData = function(element) {
        var $element = $(element);
        var path = '', vars = {v1: null, v2: null, v3: null, v4:null};
        if ($element.length === 1) {
            var $path = $element.parents('.wa-block, .wa-path');
            for(var pi = 0, pc = $path.length; pi < pc; pi++) {
                path = ($path.eq(pi).data('wa-name') || 'none') + '/' + path;
            }
            var elementType = element.tagName.toLowerCase();
            var elementSubType = '';
            switch (elementType) {
                case 'button':
                    elementSubType = element.type;
                    vars.v3 = element.name;
                    vars.v4 = $.trim($element.text());
                    break;
                case 'input':
                    elementSubType = element.type;
                    vars.v3 = element.name;
                    vars.v4 = $element.val();
                    break;
                case 'a':
                    var href = $element.attr('href');
                    if (!href || href[0] === '#') {
                        elementSubType = 'anchor';
                    } else {
                        elementSubType = 'link';
                    }
                    vars.v3 = href;
                    vars.v4 = $.trim($element.text());
                    break;
            }
            var elementName = elementType + (elementSubType ? ':' + elementSubType : '');
            path = '/' + path + elementName;
        }
        var data = {
            event: $element.data('wa-event') || 'Click',
            m: path
        };
        for(var i in vars) {
            vars[i] = $element.data('wa-' + i) || vars[i];
            if(vars[i] !== null) {
                data[i] = vars[i];
            }
        }
        return data;
    };
})(jQuery);
