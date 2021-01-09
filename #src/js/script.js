"use strict"

document.addEventListener('DOMContentLoaded', function() {

    // Эффект шума =======================================================================================
    const noise = () => {
        let canvas, ctx;
        let wWidth, wHeight;
        let noiseData = [];
        let frame = 0;
        let loopTimeout;
    
    
        // Create Noise
        const createNoise = () => {
            const idata = ctx.createImageData(wWidth, wHeight);
            const buffer32 = new Uint32Array(idata.data.buffer);
            const len = buffer32.length;
    
            for (let i = 0; i < len; i++) {
                if (Math.random() < 0.5) {
                    buffer32[i] = 0xff000000;
                }
            }
    
            noiseData.push(idata);
        };
  
  
        // Play Noise
        const paintNoise = () => {
            if (frame === 9) {
                frame = 0;
            } else {
                frame++;
            }
    
            ctx.putImageData(noiseData[frame], 0, 0);
        };
  
  
        // Loop
        const loop = () => {
            paintNoise(frame);
    
            loopTimeout = window.setTimeout(() => {
                window.requestAnimationFrame(loop);
            }, (1000 / 25));
        };
  
  
        // Setup
        const setup = () => {
            wWidth = window.innerWidth;
            wHeight = window.innerHeight * window.devicePixelRatio / 1;
    
            canvas.width = wWidth;
            canvas.height = wHeight;
    
            for (let i = 0; i < 10; i++) {
                createNoise();
            }
    
            loop();
        };
  
  
        // Reset
        let resizeThrottle;
        const reset = () => {
            window.addEventListener('resize', () => {
                window.clearTimeout(resizeThrottle);
    
                resizeThrottle = window.setTimeout(() => {
                    window.clearTimeout(loopTimeout);
                    setup();
                }, 200);
            }, false);
        };
  
  
        // Init
        const init = (() => {
            canvas = document.getElementById('noise');
            ctx = canvas.getContext('2d');
    
            setup();
        })();
    };
  
    noise();
  
    // // Smooth scroll =====================================================================
  
    const anchors = document.querySelectorAll('a[href^="#"]')
    
    for(let anchor of anchors) {
        anchor.addEventListener("click", function(e) {
        e.preventDefault() 
        const goto = anchor.hasAttribute('href') ? anchor.getAttribute('href') : 'body'
        
        document.querySelector(goto).scrollIntoView({
            behavior: "smooth",
            block: "start"
        })
        })
    }
  
    // Menu ===============================================================================
    const burger = document.querySelector('.header__burger');
    const menu = document.querySelector('.header__menu');
    const links = document.querySelectorAll('.header__menu-item');
    
    burger.addEventListener('click', function() {
        if (burger.classList.contains('active')) {
            burger.classList.remove('active');
            menu.classList.remove('active');
        } else {
        burger.classList.add('active');
        menu.classList.add('active');
        }
    });
    
    links.forEach(link => {
        link.addEventListener('click', function() {
            burger.classList.remove('active');
            menu.classList.remove('active');
        })
    })
  
  
    // // Modal ============================================================================
    const modal = document.querySelector('.overlay');
    const modalButtons = document.querySelectorAll('a[href^="#modal"]');
    const close = document.querySelectorAll('.modal__close');
    const body = document.querySelector('body');
    const request = document.getElementById('request');
    const thanks = document.getElementById('thanks');
    
    modalButtons.forEach(item => {
        item.addEventListener('click', function() {
            body.style.overflow='hidden';
            modal.classList.add('active');
            request.classList.add('active');
            thanks.classList.remove('active');

        })
    })
    
    close.forEach(item => {
        item.addEventListener('click', function() {
            body.style.overflow='auto';
            modal.classList.remove('active');
            request.classList.remove('active');
            thanks.classList.remove('active');
        })
    })


    // Form ===============================================================================
    const form = document.getElementById('form');
    if (form) {
        form.addEventListener('submit', formSend);
    }
    

    async function formSend(e) {
        console.log("Отправка запроса");
        e.preventDefault();

        let error = formValidate(form);
        let formData = new FormData(form);        

        if (error === 0) {
            let response = await fetch('sendmail.php', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                let result = await response.json();
                console.log(result.result);
                form.reset();
                request.classList.remove('active');
                thanks.classList.add('active');
            } else {
                console.log("Ошибка отправки формы");
            }
        }

    }

    function formValidate(form) {
        let error = 0;
        let formReq = document.querySelectorAll('._req');
        const warn = document.querySelectorAll('.warn');

        for (let i = 0; i < formReq.length; i++) {
            const input = formReq[i];
            const warnItem = warn[i];
            formRemoveError(input);
            warnItem.style.display = 'none';

            if (input.classList.contains('_email')) {
                if(emailTest(input)) {
                    formAddError(input);
                    warnItem.style.display = 'block';
                    error++;
                } 
            } else if (input.getAttribute("type") === "checkbox" && input.checked === false) {
                formAddError(input);
                warnItem.style.display = 'block';
                error++;
            } else if (input.value === '') {
                formAddError(input);
                warnItem.style.display = 'block';
                error++;
            }
        }
        return error;
    }

    function formAddError(input) {
        input.parentElement.classList.add('_error');
        input.classList.add('_error');
    }

    function formRemoveError(input) {
        input.parentElement.classList.remove('_error');
        input.classList.remove('_error');
    }

    function emailTest(input) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
    }

    // Gallery ==========================================================================
    @@include('fslightbox.js');

    
});
