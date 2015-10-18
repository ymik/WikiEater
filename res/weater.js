jQuery(document).ready(function () { // wikieater egg by ymik
    var eater = function () {
        var eater = function () {
            //config
            this.cursorSize = 80;
            this.spriteCycle = 650;
			this.baseImg = 'res/';
            this.cursorImg = ['weater-d.gif', 'weater-u.gif', 'weater-l.gif', 'weater-r.gif', 'weater-s.gif', 'weater-n.gif'];
            this.colors = ['#b4249d', '#ff222b', '#06b783', '#ff8c22', '#ffff10', '#ffffff', 'magenta', 'red', 'green', 'orange', 'yellow', 'cyan', '#ffffff', '#0785db', '#0589de', '#d010ae', '#ff0e14', '#03cf6e', '#ff9510', '#ffffff', '#068ade', '#c165b2', '#ff626f', '#27c1a5', '#ffab63', '#ffffff', '#ffff3d', '#27aadb', '#f595ee', '#ff8aa5', '#21f5e7', '#ffea8c', '#ffff33', '#ffff06', '#ffffff'];
            this.fillingClass = 'xzWpkmFillingElement';

            // set variables
            this.halfOfCursor = this.cursorSize / 2;
            this.x = 0;
            this.y = 0;
            this.color = 0;

            // preload images
            for (i = 0; i < this.cursorImg.length; i++) {
                $('<img />').attr('src', this.baseImg + this.cursorImg[i]);
            }

            // create cursor
            this.cursor = $('<img src="' + this.baseImg + this.cursorImg[5]
                + '" style="position:absolute;;margin:0;padding:0;border:0;z-index:10000;">')
                .appendTo($(document.body));

            this.cursor.css('left', -this.cursorSize);
            this.cursor.css('top', 0);
            this.cursor.css('width', this.cursorSize);
            this.cursor.css('height', this.cursorSize);
        };
        eater.prototype = {
            getFillColor: function () {
                this.color++;
                if (this.color % this.colors.length == 0) this.color = 0;
                return this.colors[this.color % this.colors.length];
            },
            createFilling: function (x, y, w, h, border, stopCallBack) { // create filling element
                var e = $('<div ' +
                    'style="position:absolute;z-index:9000;margin:0;padding:0;border:0;background-color:'
                    + this.getFillColor() + '"'
                    + ' class="' + this.fillingClass + '"/>').appendTo($(document.body));

                e.css('left', x);
                e.css('top', y);
                e.css('width', w);
                e.css('height', h);

                for (var b in border) {
                    e.css('border-' + border[b] + '-radius', this.halfOfCursor);
                }

                if (stopCallBack) e.click(stopCallBack);
                return e;
            },
            getDuration: function (length) {
                return 0.5 * this.spriteCycle * length / this.cursorSize;
            },
            setCursor: function (cursor, x, y) { // set packman cursor to [x,y] position
                if (x != undefined && y != undefined) {
                    this.x = x;
                    this.y = y;
                }
                this.cursor.css('top', this.y);
                this.cursor.css('left', this.x);
                this.cursor.attr('src', this.baseImg + this.cursorImg[cursor]);
            },
            clear: function () { // clear all
                this.color = 0;
                this.setCursor(5, -this.cursorSize, 0);
                $('.' + this.fillingClass).remove();
            },
            start: function (x, y, callback) { // clear all
                this.offsetX = x;
                this.offsetY = y;
                this.setCursor(4, x, y);
                window.setTimeout(callback, 2 * this.spriteCycle);

                $('<audio class="' + this.fillingClass + '" src="pcmt.mp3" autoplay>').appendTo($(document.body));
            },
            eatLeft: function (length, callback, stopCallBack) {
                var x = this.x + this.halfOfCursor, y = this.y, w = this.halfOfCursor, h = this.cursorSize;
                var filling = this.createFilling(x, y, w, h, ['top-right', 'bottom-right'], stopCallBack);
                var context = this;

                this.setCursor(2);
                this.x -= length;

                this.cursor.animate({
                        left: '-=' + length
                    },
                    {
                        duration: this.getDuration(length),
                        specialEasing: {
                            left: 'linear'
                        },
                        step: function (now, cursor) {
                            filling.css('left', now + w);
                            filling.css('width', x - now);
                        },
                        complete: callback
                    }
                );
            },
            eatRight: function (length, callback, stopCallBack) {
                var x = this.x, y = this.y, w = this.halfOfCursor, h = this.cursorSize;
                var filling = this.createFilling(x, y, w, h, ['top-left', 'bottom-left'], stopCallBack);
                var context = this;

                this.setCursor(3);
                this.x += length;

                this.cursor.animate({
                        left: '+=' + length
                    },
                    {
                        duration: this.getDuration(length),
                        specialEasing: {
                            left: 'linear'
                        },
                        step: function (now, cursor) {
                            filling.css('width', now - x + w);
                        },
                        complete: callback
                    }
                );
            },
            eatUp: function (length, callback, stopCallBack) {
                var x = this.x, y = this.y + this.halfOfCursor, w = this.cursorSize, h = this.halfOfCursor;
                var filling = this.createFilling(x, y, w, h, ['bottom-left', 'bottom-right'], stopCallBack);
                var context = this;

                this.setCursor(1);
                this.y -= length;

                this.cursor.animate({
                        top: '-=' + length
                    },
                    {
                        duration: this.getDuration(length),
                        specialEasing: {
                            left: 'linear'
                        },
                        step: function (now, cursor) {
                            filling.css('top', now + h);
                            filling.css('height', y - now);
                        },
                        complete: callback
                    }
                );
            },
            eatDown: function (length, callback, stopCallBack) {
                var x = this.x, y = this.y, w = this.cursorSize, h = this.halfOfCursor;
                var filling = this.createFilling(x, y, w, h, ['top-left', 'top-right'], stopCallBack);
                var context = this;

                this.setCursor(0);
                this.y += length;

                this.cursor.animate({
                        top: '+=' + length
                    },
                    {
                        duration: this.getDuration(length),
                        specialEasing: {
                            left: 'linear'
                        },
                        step: function (now, cursor) {
                            filling.css('height', now - y + h);
                        },
                        complete: callback
                    }
                );
            }
        };
        return new eater;
    }();

    $._wEater = {
        stop: function () {
            $._wEater.stopFlag = true;
            document.onkeydown = null;
            document.onkeyup = null;
        },
        youAreWin: function () {
            $._wEater.eater.clear();
            if (window.packmanFinishCallback)
                window.packmanFinishCallback();
        },
        nextStep: function () {
            if ($._wEater.testCell($._wEater.target, $._wEater.lRange)) {
                $._wEater.selectTarget();
            }

            if ($._wEater.stopFlag) {
                $._wEater.stopFlag = false;
                $._wEater.youAreWin();
                return;
            }

            var db = $(document), w = db.width(), h = db.height();
            var wnd = $(window), ww = wnd.width(), wh = wnd.height();

            var offsets = [
                h - (eater.y + eater.cursorSize) - eater.cursorSize,//down
                eater.y - eater.cursorSize,//up
                eater.x - eater.cursorSize,//left
                w - (eater.x + eater.cursorSize) - eater.cursorSize//right
            ];

            offsets[0] = offsets[0] > wh / 2 ? wh / 2 : offsets[0];
            offsets[1] = offsets[1] > wh / 2 ? wh / 2 : offsets[1];
            offsets[2] = offsets[2] > ww / 2 ? ww / 2 : offsets[2];
            offsets[3] = offsets[3] > ww / 2 ? ww / 2 : offsets[3];

            var i;
            for (i in offsets) {
                offsets[i] = Math.round(Math.random() * (offsets[i] / eater.cursorSize)); // snap to cell
                offsets[i] = (offsets[i] + 1) * eater.cursorSize;
            }

            var ranges = [
                {x: eater.x - $._wEater.target.x, y: eater.y + offsets[0] - $._wEater.target.y},
                {x: eater.x - $._wEater.target.x, y: eater.y - offsets[0] - $._wEater.target.y},
                {x: eater.x - offsets[0] - $._wEater.target.x, y: eater.y - $._wEater.target.y},
                {x: eater.x + offsets[0] - $._wEater.target.x, y: eater.y - $._wEater.target.y}
            ];

            for (i = 0; i < ranges.length; i++) {
                ranges[i] = ranges[i].x * ranges[i].x + ranges[i].y * ranges[i].y;
            }

            var direction = 0;
            if ($._wEater.pDirection == 0 || $._wEater.pDirection == 1) {
                ranges[0] = -1;
                ranges[1] = -1;
            } else {
                ranges[2] = -1;
                ranges[3] = -1;
            }

            for (i = 0; i < ranges.length; i++) {
                if (ranges[direction] < 0 && ranges[i] >= 0)
                    direction = i;
                if (ranges[direction] > 0 && ranges[direction] > ranges[i] && ranges[i] >= 0)
                    direction = i;
            }
            var length = offsets[direction];

            if ($._wEater.lastPressedKey != null) {
                direction = $._wEater.lastPressedKey;
                length = eater.cursorSize;

                //TODO

                var scrollTop = wnd.scrollTop(), scrollLeft = wnd.scrollLeft();
                var o = eater.cursor.offset(), x = o.left, y = o.top;

                if (scrollTop + wh < y + 2 * eater.cursorSize || scrollTop > y - eater.cursorSize)
                    wnd.scrollTop(y - wh / 2 + eater.halfOfCursor);

                if (scrollLeft + ww < x + 2 * eater.cursorSize || scrollLeft > x - eater.cursorSize)
                    wnd.scrollLeft(x - ww / 2 + eater.halfOfCursor);
            }

            $._wEater.pDirection = direction;

            var range;
            switch (direction) {
                case 0:
                    range = {
                        x1: eater.x,
                        y1: eater.y,
                        x2: eater.x + eater.cursorSize,
                        y2: eater.y + length
                    };
                    eater.eatDown(length, $._wEater.nextStep);
                    break;
                case 1:
                    range = {
                        x1: eater.x,
                        y1: eater.y - length,
                        x2: eater.x + eater.cursorSize,
                        y2: eater.y
                    };
                    eater.eatUp(length, $._wEater.nextStep);
                    break;
                case 2:
                    range = {
                        x1: eater.x - length,
                        y1: eater.y,
                        x2: eater.x,
                        y2: eater.y + eater.cursorSize
                    };
                    eater.eatLeft(length, $._wEater.nextStep);
                    break;
                case 3:
                    range = {
                        x1: eater.x,
                        y1: eater.y,
                        x2: eater.x + length,
                        y2: eater.y + eater.cursorSize
                    };
                    eater.eatRight(length, $._wEater.nextStep);
                    break;
            }

            $._wEater.removeCells(range);
            $._wEater.lRange = range;
        },
        createCells: function () {
            var db = $(document);
            var w = Math.floor(db.width() / eater.cursorSize);
            var h = Math.floor(db.height() / eater.cursorSize) + 2;
            $._wEater.cells = [];
            for (var x = 1; x < w; x++)
                for (var y = 1; y < h; y++)
                    $._wEater.cells.push({
                        x: x * eater.cursorSize + eater.offsetX + eater.halfOfCursor + 2,
                        y: y * eater.cursorSize + eater.offsetY + eater.halfOfCursor
                    });

            $._wEater.selectTarget();
        },
        testCell: function (cell, range) {
            return cell
                && range.x1 < cell.x && cell.x <= range.x2
                && range.y1 < cell.y && cell.y <= range.y2;
        },
        removeCells: function (range) {
            for (var c in $._wEater.cells) {
                if ($._wEater.testCell($._wEater.cells[c], range)) {
                    $._wEater.cells.splice(c, 1);
                }
            }
        },

        selectTarget: function () {
            if ($._wEater.cells.length < 1) {
                $._wEater.stop();
                return;
            }

            var cell = Math.floor(4 * $._wEater.cells.length * Math.random()) % $._wEater.cells.length;
            $._wEater.target = $._wEater.cells[cell];
            $._wEater.removeCells({
                x1: $._wEater.target.x, y1: $._wEater.target.y,
                x2: $._wEater.target.x + eater.cursorSize, y2: $._wEater.target.y + eater.cursorSize
            });

            if ($._wEater.targetCursor) $._wEater.targetCursor.remove();
            $._wEater.targetCursor = $('<div ' +
                'class="' + eater.fillingClass + ' wEaterTargetCursor" ' +
                'style="position:absolute;margin:0;padding:0;z-index:9000;cursor:pointer;' +
                'background-color:' + eater.colors[Math.round(Math.random() * eater.colors.length * 2) % eater.colors.length] +
                ';text-align:center;vertical-align:middle;">' +
                '<img src="' +
                $._wEater.img[Math.round(Math.random() * $._wEater.img.length * 2) % $._wEater.img.length] + '" ' +
                'style="margin:0;padding:0;border:0;height:98%;max-width:98%;">' +
                '<audio class="' + this.fillingClass + '" src="' + this.baseImg + 'pcmt.mp3" autoplay>' +
                '</div>')
                .appendTo($(document.body));

            $._wEater.targetCursor.css('left', $._wEater.target.x - eater.halfOfCursor);//TODO
            $._wEater.targetCursor.css('top', $._wEater.target.y - eater.halfOfCursor);
            $._wEater.targetCursor.css('width', eater.cursorSize);
            $._wEater.targetCursor.css('height', eater.cursorSize);
            $._wEater.targetCursor.css('border-radius', eater.halfOfCursor);
            $._wEater.targetCursor.click($._wEater.stop);

            if ($._wEater.lastPressedKey == null) {
                var wnd = $(window);
                var width = wnd.width(), height = wnd.height();
                wnd.scrollTop($._wEater.target.y - height / 2);
                wnd.scrollLeft($._wEater.target.x - width / 2);
            }
        },
        img: [
            'weater-e0.gif', 'weater-e1.gif', 'weater-e2.gif', 'weater-e3.gif', 'weater-e4.gif',
            'weater-e5.gif', 'weater-e6.gif', 'weater-e7.gif', 'weater-e8.gif', 'weater-e9.gif',
            'weater-e10.gif', 'weater-e11.gif', 'weater-e12.gif', 'weater-e13.gif', 'weater-e14.gif',
            'weater-e15.gif', 'weater-e16.gif', 'weater-e17.gif'
        ],
        lastPressedKey: null,
        keyMapping: {
            37: 2, 38: 1, 39: 3, 40: 0, 65: 2, 87: 1, 68: 3, 83: 0
        },
        pDirection: 0,
        lRange: {x1: 0, y1: 0, x2: 0, y2: 0},
        cells: [],
        target: 0,
        eater: eater
    };

    $('a.logo > img').click(function (e) {
        var logo = $(e.target).offset();
        eater.start(logo.left - 13, logo.top - 13, function () {
            document.onkeydown = function (e) {
                $._wEater.lastPressedKey = $._wEater.keyMapping[e.keyCode];
                return $._wEater.lastPressedKey == null;
            };

            document.onkeyup = function (e) {
                window.setTimeout(function () {
                    $._wEater.lastPressedKey = null;
                }, 3 * $._wEater.eater.spriteCycle);
            };
            eater.eatRight($('#wrapperContent').width(), function () {
                $._wEater.createCells();
                $._wEater.nextStep();
            });
        });
        return false;
    });
})
;