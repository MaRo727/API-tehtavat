document.getElementById('trivia-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const form = document.getElementById('trivia-form');
    form.style.display = 'none'; // Hide the form when the quiz starts

    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const type = document.getElementById('type').value;
    const difficulty = document.getElementById('difficulty').value;

    fetch(`https://opentdb.com/api.php?amount=${amount}&category=${category}&type=${type}&difficulty=${difficulty}`)
        .then(response => response.json())
        .then(data => {
            const questions = data.results;
            let currentQuestionIndex = 0;
            const correctAnswersCount = { count: 0 };

            const nextButton = document.getElementById('next-button');
            nextButton.style.display = 'none';
            nextButton.addEventListener('click', () => {
                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                    displayQuestion(questions, currentQuestionIndex, correctAnswersCount, nextButton);
                } else {
                    document.getElementById('questions-container').innerHTML = `<p>Quiz Completed! You got ${correctAnswersCount.count} out of ${questions.length} correct.</p>`;
                    nextButton.style.display = 'none';
                    form.style.display = 'block'; // Show the form again when the quiz is finished
                }
            });

            displayQuestion(questions, currentQuestionIndex, correctAnswersCount, nextButton);
        })
        .catch(error => console.error('Error fetching trivia questions:', error));
});

function displayQuestion(questions, index, correctAnswersCount, nextButton) {
    const container = document.getElementById('questions-container');
    container.innerHTML = '';

    const question = questions[index];
    const questionElement = document.createElement('div');
    questionElement.classList.add('question');

    const questionText = document.createElement('p');
    questionText.innerHTML = `Q${index + 1}: ${question.question}`;
    questionElement.appendChild(questionText);

    let options = [...question.incorrect_answers, question.correct_answer];
    if (question.type === 'multiple') {
        options.sort(() => Math.random() - 0.5); // Shuffle options only for multiple choice questions
    } else if (question.type === 'boolean') {
        options.sort((b, a) => a.localeCompare(b)); // Sort options to ensure "True" comes before "False"
    }

    options.forEach(option => {
        const optionElement = document.createElement('p');
        optionElement.classList.add('option');
        optionElement.innerHTML = option;
        optionElement.addEventListener('click', () => {
            clearTimeout(timer); // Clear the timer if the user answers
            clearInterval(countdownInterval); // Clear the countdown interval
            handleOptionClick(optionElement, question.correct_answer, correctAnswersCount, nextButton);
        });
        questionElement.appendChild(optionElement);
    });

    container.appendChild(questionElement);

    // Add timer display
    const timerDisplay = document.createElement('p');
    timerDisplay.id = 'timer';
    container.appendChild(timerDisplay);

    // Start the timer for 20 seconds
    let timeLeft = 20;
    timerDisplay.innerText = `Time left: ${timeLeft}s`;

    const countdownInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = `Time left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            nextButton.click(); // Move to the next question if time runs out
        }
    }, 1000);

    const timer = setTimeout(() => {
        clearInterval(countdownInterval);
        nextButton.click(); // Move to the next question if time runs out
    }, 20000);

    nextButton.style.display = 'none'; // Hide the next button initially
}

function handleOptionClick(optionElement, correctAnswer, correctAnswersCount, nextButton) {
    const options = optionElement.parentElement.querySelectorAll('.option');
    const correctSound = new Audio('Correct.mp3');
    const wrongSound = new Audio('wrong.mp3');

    options.forEach(option => {
        option.style.pointerEvents = 'none'; // Disable further clicks
        if (option.innerHTML === correctAnswer) {
            option.style.backgroundColor = 'lightgreen'; // Highlight correct answer
        } else {
            option.style.backgroundColor = 'lightcoral'; // Highlight incorrect answers
        }
    });

    if (optionElement.innerHTML === correctAnswer) {
        correctSound.play();
        correctAnswersCount.count++;
        showFeedbackImage('checkmark.jpg', 'bounce');
    } else {
        wrongSound.play();
        showFeedbackImage('wrong.webp', 'shake');
    }

    document.getElementById('result').innerText = `Correct Answers: ${correctAnswersCount.count}`;
    nextButton.style.display = 'block'; // Show the next button after answering
}

function showFeedbackImage(imageSrc, animationClass) {
    const feedbackImage = document.createElement('img');
    feedbackImage.src = imageSrc;
    feedbackImage.classList.add('feedback-image', animationClass);
    document.body.appendChild(feedbackImage);

    setTimeout(() => {
        feedbackImage.remove();
    }, 2000); // Remove the image after 2 seconds
}