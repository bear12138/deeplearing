/** 滑图 */
(function (window) {
    const l = 42, // 滑块边长
        r = 9, // 滑块半径
        w = 310, // canvas宽度
        h = 155, // canvas高度
        PI = Math.PI
    const L = l + r * 2 + 3 // 滑块实际边长

    function getRandomNumberByRange (start, end) {
        return Math.round(Math.random() * (end - start) + start);
    }

    function createCanvas (width, height) {
        const canvas = createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }

    function createImg (onload) {
        const img = createElement('img');
        img.crossOrigin = "Anonymous";
        img.onload = onload;
        img.onerror = () => {
            img.src = getRandomImg();
        }
        img.src = getRandomImg();
        return img;
    }

    function createElement (tagName, className) {
        const elment = document.createElement(tagName);
        elment.className = className;
        return elment;
    }

    function addClass (tag, className) {
        tag.classList.add(className);
    }

    function removeClass (tag, className) {
        tag.classList.remove(className);
    }

    function getRandomImg () {
        // return 'https://api.isoyu.com/mm_images.php';
        return  'https://raw.githubusercontent.com/bear12138/deeplearing/main/image/'+Math.floor(Math.random()*30+1)+'.png'
    }
    //绘制滑块
    function draw (ctx, x, y, operation) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI);
        ctx.lineTo(x + l, y);
        ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI);
        ctx.lineTo(x + l, y + l);
        ctx.lineTo(x, y + l);
        ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true);
        ctx.lineTo(x, y);
        ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.stroke();
        ctx[operation]();
        ctx.globalCompositeOperation = 'overlay';
    }

    function sum (x, y) {
        return x + y;
    }

    function square (x) {
        return x * x;
    }

    class jigsaw {
        constructor ({ el, onSuccess, onFail, onRefresh }) {
            el.style.position = el.style.position || 'relative';
            this.el = el;
            this.onSuccess = onSuccess;
            this.onFail = onFail;
            this.onRefresh = onRefresh;
        }

        init () {
            this.initDOM();
            this.initImg();
            this.bindEvents();
        }

        initDOM () {
            const canvas = createCanvas(w, h); // 画布
            const block = canvas.cloneNode(true); // 滑块
            const sliderContainer = createElement('div', 'sliderContainer');
            const refreshIcon = createElement('div', 'refreshIcon');
            const deleteIcon = createElement('div', 'deleteIcon');
            const IconFather = createElement('div', 'IconFather');
            const sliderMask = createElement('div', 'sliderMask');
            const slider = createElement('div', 'slider');
            const sliderIcon = createElement('span', 'sliderIcon');
            const text = createElement('span', 'sliderText');

            block.className = 'block';
            text.innerHTML = '向右滑动填充拼图';

            const el = this.el;
            el.appendChild(canvas);
            el.appendChild(IconFather);
            el.appendChild(refreshIcon)
//            IconFather.appendChild(refreshIcon);
            IconFather.appendChild(deleteIcon);
            el.appendChild(block);
            slider.appendChild(sliderIcon);
            sliderMask.appendChild(slider);
            sliderContainer.appendChild(sliderMask);
            sliderContainer.appendChild(text);
            el.appendChild(sliderContainer);

            Object.assign(this, {
                canvas,
                block,
                sliderContainer,
                refreshIcon,
                deleteIcon,
                IconFather,
                slider,
                sliderMask,
                sliderIcon,
                text,
                canvasCtx: canvas.getContext('2d'),
                blockCtx: block.getContext('2d')
            })
        }

        initImg () {
            const img = createImg(() => {
                this.draw();
                this.canvasCtx.drawImage(img, 0, 0, w, h);
                this.blockCtx.drawImage(img, 0, 0, w, h);
                const y = this.y - r * 2 - 1;
                const ImageData = this.blockCtx.getImageData(this.x - 3, y, L, L);
                this.block.width = L;
                this.blockCtx.putImageData(ImageData, 0, y);


            })
            this.img = img;

        }

        draw () {
            // 随机创建滑块的位置

            this.x = getRandomNumberByRange(L + 10, w - (L + 10));
            this.y = getRandomNumberByRange(10 + r * 2, h - (L + 10));
            draw(this.canvasCtx, this.x, this.y, 'fill');
            draw(this.blockCtx, this.x, this.y, 'clip');
            return this.x,this.y;

        }

        data_full(){

        }


        clean () {
            this.canvasCtx.clearRect(0, 0, w, h);
            this.blockCtx.clearRect(0, 0, w, h);
            this.block.width = w;
        }

        bindEvents () {
            this.el.onselectstart = () => false;
            this.deleteIcon.onclick=()=>{
                document.getElementById('captcha-father').remove();
            }
            var i=0
            this.refreshIcon.onclick = () => {

                //保存为json文件,yolo格式
                // 要保存的字符串, 需要先将数据转成字符串JSON.stringify([{name: "张三",age: 18}])
                const stringData = 0+' '+this.x/310+' '+this.y/155+' '+(this.x+63)/310+' '+(this.y+63)/155
                // dada 表示要转换的字符串数据，type 表示要转换的数据格式
                const blob = new Blob([stringData], {
                    type: 'application/json'
                })
                // 根据 blob生成 url链接
                const objectURL = URL.createObjectURL(blob)

                // 创建一个 a 标签Tag
                const aTag = document.createElement('a')
                // 设置文件的下载地址
                aTag.href = objectURL
                // 设置保存后的文件名称
                aTag.download = "yolo_test"+(i+1)+".json"
                // 给 a 标签添加点击事件
                aTag.click()
                // 释放一个之前已经存在的、通过调用 URL.createObjectURL() 创建的 URL 对象。
                // 当你结束使用某个 URL 对象之后，应该通过调用这个方法来让浏览器知道不用在内存中继续保留对这个文件的引用了。
                URL.revokeObjectURL(objectURL)
                i+=1
                this.reset();
                typeof this.onRefresh === 'function' && this.onRefresh();
                return i

            }

            let originX, originY, trail = [], isMouseDown = false;

            const handleDragStart = function (e) {
                originX = e.clientX || e.touches[0].clientX;
                originY = e.clientY || e.touches[0].clientY;
                isMouseDown = true;
            }

            const handleDragMove = (e) => {
                if (!isMouseDown) return false;
                const eventX = e.clientX || e.touches[0].clientX;
                const eventY = e.clientY || e.touches[0].clientY;
                const moveX = eventX - originX;
                const moveY = eventY - originY;
                if (moveX < 0 || moveX + 38 >= w) return false;
                this.slider.style.left = moveX + 'px';
                const blockLeft = (w - 40 - 20) / (w - 40) * moveX;
                this.block.style.left = blockLeft + 'px';

                addClass(this.sliderContainer, 'sliderContainer_active');
                this.sliderMask.style.width = moveX + 'px';
                trail.push(moveY);
            }

            const handleDragEnd = (e) => {
                if (!isMouseDown) return false;
                isMouseDown = false;
                const eventX = e.clientX || e.changedTouches[0].clientX;
                if (eventX == originX) return false;
                removeClass(this.sliderContainer, 'sliderContainer_active');
                this.trail = trail;
                const { spliced, verified } = this.verify();

                if (spliced) {
                    if (verified) {
                        addClass(this.sliderContainer, 'sliderContainer_success');
                        typeof this.onSuccess === 'function' && this.onSuccess();
                    } else {
                        addClass(this.sliderContainer, 'sliderContainer_fail');
                        this.text.innerHTML = '再试一次';
                        this.reset();
                    }
                } else {
                    addClass(this.sliderContainer, 'sliderContainer_fail');
                    typeof this.onFail === 'function' && this.onFail();
                    setTimeout(() => {
                        this.reset();
                    }, 1000)
                }
            }
            this.slider.addEventListener('mousedown', handleDragStart);
            this.slider.addEventListener('touchstart', handleDragStart);
            document.addEventListener('mousemove', handleDragMove);
            document.addEventListener('touchmove', handleDragMove);
            document.addEventListener('mouseup', handleDragEnd);
            document.addEventListener('touchend', handleDragEnd);
        }

        verify () {
            const arr = this.trail; // 拖动时y轴的移动距离
            const average = arr.reduce(sum) / arr.length;
            const deviations = arr.map(x => x - average);
            const stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length);
            const left = parseInt(this.block.style.left);


            return {
                spliced: Math.abs(left - this.x) < 10,
                verified: stddev !== 0, // 简单验证下拖动轨迹，为零时表示Y轴上下没有波动，可能非人为操作

            }
        }

        reset () {
            this.sliderContainer.className = 'sliderContainer';
            this.slider.style.left = 0;
            this.block.style.left = 0;
            this.sliderMask.style.width = 0;
            this.clean();
            this.img.src = getRandomImg();

        }

    }

    window.jigsaw = {
        init: function (opts) {
            return new jigsaw(opts).init();
        }
    }
}(window))

function init() {
    var div = document.createElement("div"); //创建段落元素
    var div2 = document.createElement("div");


    div.id="captcha";//为该元素添加id
    div2.id = "captcha-father";
    document.body.appendChild(div2);//将元素添加到页面
    document.getElementById('captcha-father').style.display = "block";
    document.getElementById('captcha-father').appendChild(div);
    jigsaw.init({
        el: document.getElementById('captcha'),
        onSuccess: function () {
            setTimeout(function () {
                document.getElementById('captcha-father').remove();

                alert("验证通过")
            },100)
        }
    })
}