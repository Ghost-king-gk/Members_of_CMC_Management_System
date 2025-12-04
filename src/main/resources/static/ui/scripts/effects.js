export function playRippleEffect(el,event) { //形参的作用： el：表示触发事件的元素，event：表示触发的事件对象
        let clientX, clientY; //定义变量 clientX 和 clientY，用于存储点击位置的坐标.
        //Let 是用于声明变量的关键字，表示 clientX 和 clientY 变量的值可以被重新赋值。
        //JS中 的变量声明不需要指定类型，变量可以是任何类型。
        if (event.touches && event.touches.length > 0) { //判断是否是触摸事件
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else { //否则是鼠标事件
            clientX = event.clientX;
            clientY = event.clientY;
        }

        const rect = el.getBoundingClientRect(); //获取元素的边界矩形信息
        const delta_X = clientX - rect.left; //计算点击位置相对于元素左上角的坐标
        const delta_Y = clientY - rect.top;
        // el.style 是用于设置或获取元素的内联样式。 这里使用 setProperty 方法设置 CSS 变量的值。
        // el = element 表示触发事件的元素。

        /**===========================================================================
         * 动态创建一个 span 元素，并设置其类名和位置，然后将其添加到触发事件的元素中。
         * 
         */


        const s = document.createElement('span'); //创建一个 span 元素
        s.className = 'ripple-effect'; //设置元素的类名为 ripple-effect
        s.style.left = delta_X + 'px'; //设置元素的位置为点击位置,相对于元素左上角
        s.style.top = delta_Y + 'px';
        el.appendChild(s); //将 span 元素添加到触发事件的元素中
        s.addEventListener('animationend', () => {  //animationend 事件表示动画结束时触发的事件
            el.removeChild(s); //动画结束后移除 span 元素
        });
    }