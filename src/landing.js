// document.addEventListener("DOMContentLoaded", function () {
//     const Box1 = document.querySelector('.box1');
//     const Box2 = document.querySelector('.box2');
//     const Box3 = document.querySelector('.box3');
//     const cir1 = document.querySelector('#box1');
//     const cir2 = document.querySelector('#box2');
//     const cir3 = document.querySelector('#box3');

//     cir2.addEventListener('click', () => {
//         Box1.classList.add('active');
//         Box3.classList.add('active');
//         Box2.classList.remove('active');
//     });

//     cir3.addEventListener('click', () => {
//         Box1.classList.add('active');
//         Box2.classList.add('active');
//         Box3.classList.remove('active');
//     });

//     cir1.addEventListener('click', () => {
//         Box3.classList.add('active');
//         Box2.classList.add('active');
//         Box1.classList.remove('active');
//     });
// });

document.addEventListener("DOMContentLoaded", function () {
    const box1 = document.querySelector('.box1');
    const box2 = document.querySelector('.box2');
    const box3 = document.querySelector('.box3');

    // function rotateBoxes() {
    //     if (box1.classList.contains('active')) {
    //         box1.classList.remove('active');
    //         box2.classList.add('active');
    //         box3.classList.add('active');
    //     } else if (box2.classList.contains('active')) {
    //         box2.classList.remove('active');
    //         box3.classList.add('active');
    //         box1.classList.add('active');
    //     } else if (box3.classList.contains('active')) {
    //         box3.classList.remove('active');
    //         box1.classList.add('active');
    //         box2.classList.add('active');
    //     }
    // }

    function rotateBoxes() {
        if (box1.classList.contains('active')) {
            box1.classList.remove('active');
            box2.classList.add('active');
        } else if (box2.classList.contains('active')) {
            box2.classList.remove('active');
            box1.classList.add('active');
        }
    }

    // Automatically change the box every 5 seconds (5000 milliseconds)
    setInterval(rotateBoxes, 2500);

    // Initial call to start the animation
    rotateBoxes();
});
