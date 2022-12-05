import React from "react";
import { useState, useEffect } from "react";

export const Game = (data) => {
	const { id, center, peripheral, words, maxScore, rankings } = data;

	// Create clone of peripherals for mutation
	const [peripherals, setPeripherals] = useState([...peripheral]);

	// Assign positions to peripheral letters so that they can be shuffled at will
	var p1 = peripherals[0];
	var p2 = peripherals[1];
	var p3 = peripherals[2];
	var p4 = peripherals[3];
	var p5 = peripherals[4];
	var p6 = peripherals[5];

	// Tracks input letters
	const [word, setWord] = useState("");

	// Tracks culmulative score for found words
	const [score, setScore] = useState(0);

	// Tracks ranking according to score
	const [ranking, setRanking] = useState("Beginner");

	// Tracks words that have been found
	const [foundWords, setFoundWords] = useState([]);

	// Tracks most recent foundWords
	const [recentFoundWords, setRecentFoundWords] = useState([]);

	// Tracks whether foundWords dropdown is open or closed
	const [open, setOpen] = useState(false);

	// Tracks whether info modal is open or close
	const [modalOpen, setModalOpen] = useState([false, ""]);

	// Copy of accepted words from data
	var remainingWords = words;

	// Ranking titles
	const rankingTitles = rankings.reverse().map((i) => {
		return i[0];
	});

	// Corresponding ranking scores
	const rankingScores = rankings.map((i) => {
		return i[1];
	});

	// Add letter to state of word
	const handleClick = (e) => {
		e.preventDefault();
		setWord(word + e.target.value);
	};

	// Remove last input letter in state of word
	const backspace = (e) => {
		e.preventDefault();
		if (word.length > 0) {
			setWord(word.slice(0, -1));
		}
	};

	// Toggles foundWords dropdown to open or closed
	const toggleFoundWords = (e) => {
		if (foundWords.length === 0) {
			e.preventDefault();
		} else {
			e.preventDefault();
			e.target.value = !open;
			setOpen(!open);
		}
	};

	// Toggles info modal to open or closed
	const toggleInfoModal = (info) => {
		setModalOpen([true, info]);
		setTimeout(() => {
			setModalOpen([!modalOpen, ""]);
		}, 1000);
	};

	// Update state of foundWords array
	const updateFoundWords = (newWord) => {
		setFoundWords((oldWords) => [newWord, ...oldWords]);
	};

	// Update most recent foundWords
	useEffect(() => {
		if (foundWords.length > 4) {
			setRecentFoundWords([...foundWords].splice(0, 4));
		} else {
			setRecentFoundWords(foundWords);
		}
	}, [foundWords]);

	// Calculate score of accepted unfound word
	// 1 point for 4 letter words, 1 point per letter for words 5 letters or longer
	const calculateWordScore = (e) => {
		if (e.length === 4) {
			return 1;
		} else {
			return e.length;
		}
	};

	// Update score if accepted unfound word is input
	const updateScore = (e) => {
		setScore((score) => score + e);
	};

	// Update Ranking with increasing score
	const updateRanking = () => {
		if (score === maxScore) {
			setModalOpen("Queen Bee!");
			updateRanking("Queen Bee");
		} else {
			var scoreIndex = [...rankingScores].find(function (e) {
				return score >= e;
			});
			setRanking(rankingTitles[rankingScores.indexOf(scoreIndex)]);
		}
	};

	// Fire updateRanking after score has been updated
	useEffect(() => {
		updateRanking();
		// eslint-disable-next-line
	}, [score]);

	// Check conditions of entered word to verify that is an accepted word
	const checkWord = (e) => {
		e.preventDefault();
		// Blank entries are not accepted
		if (word.length === 0) {
			toggleInfoModal("Enter a word");
		}
		// Words shorter than 4 letters are not accepted
		else if (word.length > 0 && word.length < 4) {
			toggleInfoModal("Too Short");
			setWord("");
		}
		// Words must include center letter
		else if (remainingWords.includes(word) && word.includes(center)) {
			// If word contains center letter and all peripheral letters then it is called a pangram
			if (peripherals.every((i) => word.includes(i))) {
				toggleInfoModal("Pangram!");
			}
			updateFoundWords(word);
			var index = remainingWords.indexOf(word);
			remainingWords.splice(index, 1);
			updateScore(calculateWordScore(word));
			setWord("");
		}
		// If word already exists in foundWord array, it is not accepted
		else if (foundWords.includes(word)) {
			toggleInfoModal("Already found");
			setWord("");
		} else {
			toggleInfoModal("Word not found");
			setWord("");
		}
	};

	// Fisher-Yates method used to shuffle letter positions on click
	const shuffleLetters = (e) => {
		e.preventDefault();
		let a = [...peripherals];
		let i = a.length;
		while (--i > 0) {
			let randIndex = Math.floor(Math.random() * (i + 1));
			[a[randIndex], a[i]] = [a[i], a[randIndex]];
		}
		setPeripherals(a);
	};

	// Reload page to generate new game on click
	const reloadPage = () => {
		window.location.reload();
		setModalOpen("Generating words...");
	};

	return (
		<section>
			<section className="top">
				<article className="date">{id}</article>
				<article className="score">
					{score} - {ranking}
				</article>
				<section className="found-words_container">
					<article className="found-words_display">
						<article className="found-words">
							{recentFoundWords.map((word, i) => {
								return <p key={i}>{word}</p>;
							})}
						</article>
						<button
							aria-label="See all found words"
							onClick={toggleFoundWords}
							value={open}
						>
							<span></span>
						</button>
					</article>
					{open ? (
						<article className="found-words_detailed-container open">
							<article className="word-count">
								<h3>
									{foundWords.length} of{" "}
									{words.length + foundWords.length} words
									found
								</h3>
							</article>
							<article className="found-words_detailed">
								{foundWords.sort().map((word, i) => {
									return <p key={i}>{word}</p>;
								})}
							</article>
						</article>
					) : (
						<article className="found-words_detailed-container"></article>
					)}
				</section>
			</section>
			<section className="letters-container">
				<article className="word">
					<p>{word}</p>
				</article>
				<article className="letters">
					<button value={p1} className="p1" onClick={handleClick}>
						{p1}
					</button>
					<button value={p2} className="p2" onClick={handleClick}>
						{p2}
					</button>
					<button value={p3} className="p3" onClick={handleClick}>
						{p3}
					</button>
					<button
						className="center"
						value={center}
						onClick={handleClick}
					>
						{center}
					</button>
					<button value={p4} className="p4" onClick={handleClick}>
						{p4}
					</button>
					<button value={p5} className="p5" onClick={handleClick}>
						{p5}
					</button>
					<button value={p6} className="p6" onClick={handleClick}>
						{p6}
					</button>
				</article>
			</section>
			<section className="editing">
				<article className="backspace">
					<button onClick={backspace}>Delete</button>
				</article>
				<article className="shuffle-letters">
					<button
						aria-label="Shuffle letters"
						onClick={shuffleLetters}
					>
						<span></span>
					</button>
				</article>
				<article className="submit-word">
					<button onClick={checkWord}>Enter</button>
				</article>
			</section>
			<section className="new-game">
				<button className="reload-page" onClick={reloadPage}>
					Generate New Game
				</button>
			</section>
			{modalOpen[0] === false ? (
				<section className="info-modal_container"></section>
			) : (
				<section className="info-modal_container open">
					<article className="info-modal">
						<h2>{modalOpen}</h2>
					</article>
				</section>
			)}
		</section>
	);
};
