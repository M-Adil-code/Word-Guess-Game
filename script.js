let inputboxarea = document.querySelector('.inputsboxarea');
let reterybtn = document.querySelector('button');
let hintbox = document.querySelector('.hint');
let wrongword = document.querySelector('.wrongword');
let guessword = document.querySelector('.guessword');
let remaining = document.querySelector('.remaining');

let data;
let index = 0;
let currentWord = "";
let wrongGuesses = [];
let keys = [];

//  Fetch JSON Data
let getdata = async function () {
    try {
        const res = await fetch('data.json');
        const response = await res.json();
        data = response;
        remaining.innerHTML = 7;
        manipulateData();
    } catch (err) {
        console.log('error:', err);
    }
};

//  Render the current word & hint
let manipulateData = () => {
    inputboxarea.innerHTML = '';
    wrongGuesses = [];
    wrongword.innerHTML = '';
    keys = [];
    remaining.innerHTML = 7;

    if (index < data.length) {
        let word = data[index].word;
        let hint = data[index].hint;
        currentWord = word;
        hintbox.innerHTML = hint;

        for (let i = 0; i < word.length; i++) {
            let newbox = document.createElement('input');
            newbox.disabled = true;
            inputboxarea.appendChild(newbox);
        }
    } else {
        // Game Finished
        inputboxarea.innerHTML = '';
        reterybtn.classList.remove('d-none');
        reterybtn.innerHTML = 'Play Again';
        reterybtn.onclick = () => {
            index = 0;
            manipulateData();
            reterybtn.classList.add('d-none');
        };
    }
};


window.addEventListener('keyup', (e) => {
    if (!currentWord || reterybtn.classList.contains('d-none') === false) return;

    const key = e.key.toLowerCase();

    if (currentWord.includes(key)) {
        for (let i = 0; i < currentWord.length; i++) {
            if (currentWord[i] === key) {
                inputboxarea.children[i].value = key;
            }
        }
    } else {
        if (!wrongGuesses.includes(key) && Number(remaining.innerHTML) > 0) {
            wrongGuesses.push(key);
            remaining.innerHTML = Number(remaining.innerHTML) - 1;
            wrongword.innerHTML = wrongGuesses.join(', ');
        }
    }

    //  Check if word is complete
    const isComplete = Array.from(inputboxarea.children).every(input => input.value !== '');
    if (isComplete) {
        reterybtn.classList.remove('d-none');
        reterybtn.innerHTML = 'Next';
        reterybtn.onclick = () => {
            index++;
            reterybtn.classList.add('d-none');
            manipulateData();
        };
    }

    //  Out of attempts
    if (Number(remaining.innerHTML) === 0) {
        reterybtn.classList.remove('d-none');
        reterybtn.innerHTML = 'Retry';
        reterybtn.onclick = () => {
            remaining.innerHTML = 7;
            wrongGuesses = [];
            wrongword.innerHTML = '';
            for (let input of inputboxarea.children) input.value = '';
            reterybtn.classList.add('d-none');
        };
    }
});

getdata();
