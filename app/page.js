"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [userState, setUserState] = useState([]);
  const [secondUserState, setSecondUserState] = useState([]);
  const [winner, setWinner] = useState(null);
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const squares = Array.from({ length: 9 }, (_, i) => i);
  const SetClass = ({ index }) => {
    if (index >= 0 <= 2) {
      return "center";
    } else if (index >= 3 <= 5) {
      return "row-start-2 center";
    } else if (index >= 6 <= 8) {
      return "row-start-3 center";
    }
  };
  const checkAvailableSquares = squares.filter(
    (square) => !userState.includes(square) && !secondUserState.includes(square)
  );
  const calculateNextMove = () => {
    const combinationsLeftForBot = winningCombinations.filter((combination) => {
      return (
        !userState.includes(combination[0]) &&
        !userState.includes(combination[1]) &&
        !userState.includes(combination[2])
      );
    });
    const combinationsLeftForUser = winningCombinations.filter(
      (combination) => {
        return (
          !secondUserState.includes(combination[0]) &&
          !secondUserState.includes(combination[1]) &&
          !secondUserState.includes(combination[2])
        );
      }
    );
    const checkWinningMove = (state) => {
      const blockingMove = [];
      for (let index = 0; index < combinationsLeftForUser.length; index++) {
        let data = combinationsLeftForUser[index];

        for (let i = 0; i < state.length; i++) {
          if (data.includes(state[i])) {
            data.splice(data.indexOf(state[i]), 1);
          }
        }
        blockingMove.push(data);
      }
      blockingMove.sort((a, b) => a.length - b.length);
      if (blockingMove[0].length === 1) {
        return blockingMove[0];
      }
    };
    const blockMove = checkWinningMove(userState);
    if (blockMove) {
      return blockMove;
    }
    if (userState.length === 0) {
      return;
    }
    if (secondUserState.length === 1) {
      const randomSquare = Math.floor(
        Math.random() * checkAvailableSquares.length
      );
      return checkAvailableSquares[randomSquare];
    } else {
      const nextMove = [];
      for (let index = 0; index < combinationsLeftForBot.length; index++) {
        let data = combinationsLeftForBot[index];

        for (let i = 0; i < secondUserState.length; i++) {
          if (data.includes(secondUserState[i])) {
            data.splice(data.indexOf(secondUserState[i]), 1);
          }
        }
        nextMove.push(data);
      }
      nextMove.sort((a, b) => a.length - b.length);
      return nextMove[0];
    }
  };
  useEffect(() => {
    if (winner || checkAvailableSquares.length === 0) return;

    const checkWinner = (state, player) => {
      winningCombinations.forEach((combination) => {
        if (combination.every((index) => state.includes(index))) {
          setWinner(player);
        }
      });
    };

    checkWinner(userState, "User");
    checkWinner(secondUserState, "Bot");

    if (!winner && userState.length > secondUserState.length) {
      const nextMove = calculateNextMove();
      console.log(nextMove, "nextMove");
      if (Array.isArray(nextMove)) {
        setSecondUserState([
          ...secondUserState,
          nextMove[Math.floor(Math.random() * nextMove.length)],
        ]);
      } else {
        setSecondUserState([...secondUserState, nextMove]);
      }
    }
  }, [userState, secondUserState, winner]);

  const clearBoard = () => {
    setUserState([]);
    setSecondUserState([]);
    setWinner(null);
  };
  return (
    <div className="flex justify-center items-center flex-col gap-8 h-full w-full">
      <h1 className="font-bold text-2xl text-green-400">
        {winner === "User" && "User Wins!"}
      </h1>
      <h1 className="font-bold text-2xl text-red-400">
        {winner === "Bot" && "Bot Wins!"}
      </h1>
      <h1 className="font-bold text-2xl text-blue-400">
        {winner === "Draw" && "It's a draw!"}
      </h1>

      <div className="grid grid-cols-3 grid-rows-3 gap-4 w-[300px] h-[300px] relative">
        <div className="absolute w-[2px] h-full bg-gray-200 left-[100px]" />
        <div className="absolute w-full h-[2px] bg-gray-200 top-[100px]" />
        <div className="absolute w-[2px] h-full bg-gray-200 right-[100px]" />
        <div className="absolute w-full h-[2px] bg-gray-200 bottom-[100px]" />

        {squares.map((square, index) => (
          <div
            key={square}
            className={SetClass(index)}
            onClick={() => {
              if (
                userState.includes(square) ||
                secondUserState.includes(square)
              )
                return;

              setUserState([...userState, square]);
            }}
          >
            {userState.includes(square) && (
              <Image src="/x.png" width={50} height={50} alt="X" className="" />
            )}
            {secondUserState.includes(square) && (
              <Image src="/o.png" width={50} height={50} alt="O" />
            )}
          </div>
        ))}
      </div>
      <button
        onClick={() => clearBoard()}
        className="bg-grey-lightest rounded-full p-4 shadow-lg font-medium hover:translate-y-[-5px] transition-transform duration-300 ease-in-out w-[200px] border-[1px] border-gray-400"
      >
        Clear board
      </button>
    </div>
  );
}
