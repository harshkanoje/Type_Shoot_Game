// Import the necessary modules
const axios = require('axios');
const readline = require('readline');

// Function to generate a random set of words
async function generateRandomWords(numberOfWords) {
  try {
    const response = await axios.get(`https://random-word-api.herokuapp.com/word?number=${numberOfWords}`);
    const randomWords = response.data;
    return randomWords;
  } catch (error) {
    console.error('Error fetching random words:', error);
    return [];
  }
}

// Function to calculate WPM, accuracy, and mistakes
function calculateStats(inputWords, typedWords, timeInMinutes) {
  // Calculate WPM
  const typedWordCount = typedWords.length;
  const wpm = Math.round(typedWordCount / timeInMinutes);

  // Calculate accuracy
  let correctCount = 0;
  for (let i = 0; i < typedWordCount; i++) {
    if (inputWords[i] === typedWords[i]) {
      correctCount++;
    }
  }
  const accuracy = ((correctCount / typedWordCount) * 100).toFixed(2);

  // Calculate mistakes
  const mistakeCount = typedWordCount - correctCount;

  return { wpm, accuracy, mistakeCount };
}

// Function to start the typing game
async function startTypingGame() {
  const numberOfWords = 5; // Number of random words to generate
  const randomWords = await generateRandomWords(numberOfWords);
  const inputWords = randomWords.join(' '); // Join the words into a single string
  console.log('Type the following words:');
  console.log(inputWords);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const startTime = new Date();
  let typedWords = '';

  rl.on('line', (input) => {
    typedWords += input.trim() + ' ';

    if (typedWords.split(' ').length >= numberOfWords) {
      const endTime = new Date();
      const timeElapsed = (endTime - startTime) / 1000 / 60; // Convert to minutes

      const { wpm, accuracy, mistakeCount } = calculateStats(inputWords.split(' '), typedWords.split(' '), timeElapsed);
      console.log(`\nWords per minute (WPM): ${wpm}`);
      console.log(`Accuracy: ${accuracy}%`);
      console.log(`Mistakes: ${mistakeCount}`);

      rl.close();
    }
  });
}

// Start the typing game
startTypingGame();
