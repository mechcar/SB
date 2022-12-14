import dictionary from "./dictionary";

const alphabet = "abcdefghijklmnopqrstuvwxyz";
const alphabetArray = alphabet.split("");

var shuffledLetters = [];
var letters = [];

const shuffleAlphabet = () => {
	letters = [];
	shuffledLetters = [...alphabetArray]
		.sort(function () {
			return 0.5 - Math.random();
		})
		.join("");
	for (var i = 0; i < 7; i++) {
		letters.push(shuffledLetters.charAt(i));
	}
};

// Test array to verify that approved words can be formed from selected letters
var acceptedWords = [];
var pangramCheck = false;
var checkAcceptedWords = () => {
	var regex = "^[" + letters.join("") + "]*$";
	for (var entry = 0; entry < dictionary.length; entry++) {
		if (
			dictionary[entry].includes(letters[0]) &&
			dictionary[entry].charAt(0) !==
				dictionary[entry].charAt(0).toUpperCase() &&
			dictionary[entry].match(regex) &&
			dictionary[entry].length >= 4 &&
			dictionary[entry].length <= 9
		) {
			acceptedWords.push(dictionary[entry]);
		}
	}
	for (var j = 0; j < acceptedWords.length; j++) {
		// Check to see that the acceptedWords array contains at least 1 pangram
		if (letters.every((letter) => acceptedWords[j].includes(letter))) {
			pangramCheck = true;
		}
	}
};

// Shuffle letters and check until 25 words are listed
var acceptedLength = false;
while (acceptedLength === false) {
	pangramCheck = false;
	acceptedWords = [];
	shuffleAlphabet();
	checkAcceptedWords();
	// Check to see if word list contains at least 25 words and at least 1 pangram
	if (
		acceptedWords.length >= 25 &&
		acceptedWords.length <= 60 &&
		pangramCheck
	) {
		acceptedLength = true;
		break;
	}
}

if ((acceptedLength = true)) {
	// Used to calculate the max score of all accepted words
	var maxScoreValue = 0;
	const calcMaxScore = () => {
		let currentWordSet = acceptedWords;
		for (let i = 0; i < currentWordSet.length; i++) {
			if (currentWordSet[i].length === 4) {
				maxScoreValue += 1;
			} else {
				maxScoreValue += currentWordSet[i].length;
			}
		}
	};
	calcMaxScore();

	var rankingValues = [
		{ rank: "Beginner", score: 0 },
		{ rank: "Good Start", score: 0.02 },
		{ rank: "Moving Up", score: 0.05 },
		{ rank: "Good", score: 0.08 },
		{ rank: "Solid", score: 0.15 },
		{ rank: "Nice", score: 0.25 },
		{ rank: "Great", score: 0.4 },
		{ rank: "Amazing", score: 0.5 },
		{ rank: "Genius", score: 0.7 },
		{ rank: "Queen Bee", score: 1 },
	];

	// Calculate rankings based on max score
	const generateRankings = () => {
		var rankings = rankingValues.map((item) => [
			item.rank,
			Math.round(maxScoreValue * item.score),
		]);
		return rankings;
	};

	// Create object for use in game
	var data = {
		center: letters[0],
		peripheral: letters.splice(1, 6),
		words: acceptedWords,
		maxScore: maxScoreValue,
		rankings: generateRankings(),
	};
}

console.log(data.center, data.peripheral, data.words);
export default data;
