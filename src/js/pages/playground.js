document.addEventListener('DOMContentLoaded', () => {
    const sliderFunction = () => {
        const sliderImages = document.querySelector('.slider-images');
        const lines = [...document.querySelectorAll('.slider-lines .line')];
        const leftSlide = document.querySelector('.left');
        const rightSlide = document.querySelector('.right');
        const w = sliderImages.querySelector('img').clientWidth + 30;

        const calcTranslate = (val) => {
            return `translateX(calc(-${val*100}% - ${val*30}px))`;
        }

        const changeActive = (item, lastItem) => {
            item.setAttribute('data-active', 'true');
            lastItem.setAttribute('data-active', 'false');
        }

        let currIndex = 0;
        leftSlide.addEventListener('click', () => {
            // sliderImages.scrollBy({left: -w, behavior: "smooth"})
            if (currIndex > 0) {
                currIndex--;
                sliderImages.style.transform = calcTranslate(currIndex);
                changeActive(lines[currIndex], lines[currIndex+1])
            }
        });

        rightSlide.addEventListener('click', () => {
            // sliderImages.scrollBy({left: w, behavior: "smooth"});
            if (currIndex < 2) {
                currIndex++;
                sliderImages.style.transform = calcTranslate(currIndex);
                changeActive(lines[currIndex], lines[currIndex-1]);
            }
        })
    }

    const calculatorFunction = () => {
        const result = document.querySelector('.calculator-result span');
        const buttons = document.querySelector('.calculator-buttons');

        if (localStorage.getItem('calc-result') != 0 && localStorage.getItem('calc-result') != null) {
            result.textContent = localStorage.getItem('calc-result');
        } else {
            localStorage.setItem('calc-result', 0);
            result.textContent = 0;
        }

        const calc = (e, lastElem, firstAction, firstStr, secondStr, actions, action) => {
            if ((result.textContent == 0 || isFinite(lastElem)) && !actions.test(result.textContent)) {
                result.textContent += e.target.textContent;
            } else if (lastElem == '-' || lastElem == '+' || lastElem == '×' || lastElem == '÷') {
                result.textContent = result.textContent.slice(0, lastIndex) + e.target.textContent;
            } else if (result.textContent.match(actions)) {
                let prevAction = result.textContent.slice(1, ).match(action)[0];
                if (lastElem == 0 && (firstAction =='×' || firstAction == '÷')) {
                    result.textContent = '0' + e.target.textContent;
                } else if  (prevAction == '÷') {
                    result.textContent = +result.textContent.match(firstStr)[0] /
                    +result.textContent.match(secondStr)[0].slice(1) + e.target.textContent;
                    localStorage.setItem('calc-result', result.textContent.slice(0, result.textContent.length - 1));
                } else if (prevAction == '×') {
                    result.textContent = +result.textContent.match(firstStr)[0] *
                    +result.textContent.match(secondStr)[0].slice(1) + e.target.textContent;
                    localStorage.setItem('calc-result', result.textContent.slice(0, result.textContent.length - 1));
                } else if (prevAction == '+') {
                    result.textContent = +result.textContent.match(firstStr)[0] +
                    +result.textContent.match(secondStr)[0].slice(1) + e.target.textContent;
                    localStorage.setItem('calc-result', result.textContent.slice(0, result.textContent.length - 1));
                } else {
                    result.textContent = +result.textContent.match(firstStr)[0] -
                    +result.textContent.match(secondStr)[0].slice(1) + e.target.textContent;
                    localStorage.setItem('calc-result', result.textContent.slice(0, result.textContent.length - 1));
                }
            }
        }

        buttons.addEventListener('click', e => {
            const firstStr = /^-?\d+(\.\d+)?/;
            const action = /[-+×÷]{1}/;
            const actions = /[-+×÷]/g;
            const zeroOccasion = /[-+×÷]0/;
            const firstAction = result.textContent.match(action) ? result.textContent.match(action)[0] : false;
            const secondStr = /[-+×÷]{1}\d+(\.\d+)?$/;
            const lastIndex = result.textContent.length - 1;
            const lastElem = result.textContent[lastIndex];
            const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
            const actionsList = ['%', '÷', '×', '-', '+'];
            const len = result.textContent.length;

            switch (e.target.classList[1]) {
                case "clear":
                    result.textContent = 0;
                    localStorage.setItem('calc-result', 0);
                    break;
                case "divide":
                case "multiply":
                case "minus":
                case "plus":
                    calc(e, lastElem, firstAction, firstStr, secondStr, actions, action);
                    break;
                case "b1": case "b2": case "b3": case "b4": case "b5":
                case "b6": case "b7": case "b8": case "b9": case "b0":
                    if (result.textContent === '0') {
                        result.textContent = e.target.textContent;
                    } else if (digits.includes(lastElem) || lastElem === '.') {
                        if (!zeroOccasion.test(result.textContent)) {
                            result.textContent += e.target.textContent;
                        } else {
                            result.textContent = result.textContent.slice(0, len - 1) + e.target.textContent;
                        }
                    } else if (action.test(lastElem)) {
                        result.textContent += e.target.textContent;
                    }
                    break;
                case "point":
                    if (!actionsList.includes(lastElem) && lastElem != '.') {
                        if (secondStr.test(result.textContent)) {
                            console.log(!result.textContent.match(secondStr)[0].slice(1).includes('.'));
                        }
                        if ((!action.test(result.textContent) && !result.textContent.includes('.')) || (action.test(result.textContent) && secondStr.test(result.textContent) && !result.textContent.match(secondStr)[0].slice(1).includes('.'))) {
                            result.textContent += '.';
                        }
                    };
                    break;
                case "equal":
                    if (secondStr.test(result.textContent)) {
                        calc(e, lastElem, firstAction, firstStr, secondStr, actions, action);
                        result.textContent = result.textContent.slice(0, result.textContent.length - 1);
                        localStorage.setItem('calc-result', result.textContent);
                    }
            }
        })
    }

    const taskManager = () => {
        const taskInput = document.getElementById('task-input');
        const taskBtn = document.querySelector('.add-task');
        const tasksList = document.querySelector('.mission-queue__tasks');
        
        const createTask = (num, text) => {
            return `
            <li class=task${num}>
                <input type="checkbox" name="task" id="task${num}">
                <label for="task${num}">${text}</label>
            </li>
        `
        }

        tasksList.addEventListener('change', e => {
            // tasksList.removeChild(e.target.closest('li'));
        });

        taskBtn.addEventListener('click', () => {
            const tasksLength = tasksList.querySelectorAll('li').length;
            if (taskInput.value.length > 2) {
                console.log(tasksLength);
                tasksList.insertAdjacentHTML('beforeend', createTask(tasksLength + 1, taskInput.value));
            }
        })
    }

    const formValidation = () => {
        const identity = document.getElementById('identity');
        const pas = document.getElementById('password');
        const comm = document.getElementById('comm');
        const finalize = document.querySelector('.finalize');
        const inputsLists = [identity, pas, comm];
        const errMessages = document.querySelectorAll('[class^=err-]');
        const strength = document.querySelector('.pas-strength p span');
        const lines = document.querySelectorAll('.pas-line');

        // pass
        const upCase = /[A-ZА-ЯЁ]/;
        const letters = /[a-zа-яё]/;
        const digits = /\d/;
        const specialSymbols = /[!@#$%^&\*\(\)—_\+=;:,\./\?|`~\[\]\{\}]/;

        const checkPas = (len, ...tests) => {
            const trueChecks = tests.filter(test => test == true);
            if (len < 3) {
                return 'low, 0';
            } else if (trueChecks.length === 1) {
                return 'low, 1';
            } else if (trueChecks.length === 2) {
                return 'normal, 2';
            } else if (trueChecks.length === 3) {
                return 'high, 3';
            } else if (trueChecks.length === 4) {
                return 'very high, 4';
            }
        }

        // mail
        const mailReg = /^[0-9a-zа-яё]{5,}@[a-z]{2,}\.[a-z]{2,}$/i;

        finalize.addEventListener('click', e => {
            e.preventDefault();
            if (identity.value.length < 3 && !digits.test(identity.value)) {
                identity.nextElementSibling.textContent = 'length should be more than 2'
            }
            if (!mailReg.test(comm.value)) {
                comm.nextElementSibling.textContent = 'incorrect mail';
            }
            if (pas.value.length < 3) {
                pas.nextElementSibling.textContent = 'length should be more than 2';
            } else if (pas.value.includes('-')) {
                pas.nextElementSibling.textContent = 'incorrect symbols';
                
            }
            
        })

        inputsLists.forEach((val, index) => {
            val.addEventListener('input', e => {
                errMessages[index].textContent = '';
            })
        })

        pas.addEventListener('input', e => {
            const checkResult = checkPas(pas.value.length, upCase.test(pas.value), digits.test(pas.value), letters.test(pas.value), specialSymbols.test(pas.value));
            const result = checkResult.split(', ');
            strength.textContent = result[0].toUpperCase();
            if (result[1] === '0') {
                for (let i = 0; i < lines.length; i++) {
                    lines[i].style.backgroundColor = '#192540';
                }
            } else if (result[1] === '1') {
                lines[0].style.backgroundColor = '#A3A6FF';
                lines[1].style.backgroundColor = '#192540';
                lines[2].style.backgroundColor = '#192540';
                lines[3].style.backgroundColor = '#192540';
                
            } else if (result[1] === '2') {
                lines[0].style.backgroundColor = '#A3A6FF';
                lines[1].style.backgroundColor = '#A3A6FF';
                lines[2].style.backgroundColor = '#192540';
                lines[3].style.backgroundColor = '#192540';
            } else if (result[1] === '3') {
                lines[0].style.backgroundColor = '#A3A6FF';
                lines[1].style.backgroundColor = '#A3A6FF';
                lines[2].style.backgroundColor = '#A3A6FF';
                lines[3].style.backgroundColor = '#192540';
            } else {
                lines[0].style.backgroundColor = '#A3A6FF';
                lines[1].style.backgroundColor = '#A3A6FF';
                lines[2].style.backgroundColor = '#A3A6FF';
                lines[3].style.backgroundColor = '#A3A6FF';
            }
        })

    }

    function getCookie(name)  {
        const cookies = document.cookie.split('; ').map(item => item.split('='));
        return Object.fromEntries(cookies)[name];
    }

    function checkAuth() {
        if (getCookie('isAuth')) {
            window.location.href = '../dashboard.html';
        } else {
            window.location.href = 'auth.html';
        }
    }

    checkAuth();
    sliderFunction();
    calculatorFunction();
    taskManager();
    formValidation();
})