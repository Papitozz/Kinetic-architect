document.addEventListener('DOMContentLoaded', () => {
    const formValidation = () => {
        const identity = document.getElementById('mail');
        const pas = document.getElementById('password');
        const initialize = document.querySelector('.initialize');
        const inputsLists = [identity, pas];
        const strength = document.querySelectorAll('.auth label span');

        // pass
        const upCase = /[A-ZА-ЯЁ]/;
        const letters = /[a-zа-яё]/;
        const digits = /\d/;
        const specialSymbols = /[!@#$%^&\*\(\)—_\+=;:,\./\?|`~\[\]\{\}]/;

        // mail
        const mailReg = /^[0-9a-zа-яё\.]{5,}@[a-z]{2,}\.[a-z]{2,}$/i;
        let counter = 0;

        initialize.addEventListener('click', e => {
            e.preventDefault();
            if (pas.value.length < 3) {
                strength[1].textContent = 'length should be more than 2';
                counter = 0;
            } else if (pas.value.includes('-')) {
                strength[1].textContent = 'incorrect symbols';
                counter = 0;
            } else {
                ++counter;
                console.log(counter)
            }
            if (!mailReg.test(identity.value)) {
                strength[0].textContent = 'incorrect mail';
                counter = 0;
            } else {
                ++counter;
                console.log(counter)
            }

            if (counter > 1) {
                document.cookie = 'isAuth=true; path=/';
                console.log(counter)
                counter = 0;
                document.location.href = '../dashboard.html';
            }
            
        })

        inputsLists.forEach((val, index) => {
            val.addEventListener('input', e => {
                strength[index].textContent = '';
                counter = 0;
            })
        })

    }

    formValidation();
})