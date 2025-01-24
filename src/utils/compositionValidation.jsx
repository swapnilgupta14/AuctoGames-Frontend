export default function validatePlayerTypeCount(playerType, playerTypeCount) {
  let playerType = playerType.split(" ")?.[0];

  if (playerType === "Wicket-Keeper") {
    playerType = "Wicket Keeper";
  } else if (playerType === "All-Rounder") {
    playerType = "All Rounder";
  } else if (playerType === "Batsmen") {
    playerType = "Batsman";
  }

  const MAX_PLAYERS = 11;
  const rules = {
    Batsman: { min: 3, max: 4 },
    Bowler: { min: 4, max: 4 },
    "Wicket Keeper": { min: 1, max: 2 },
    "All Rounder": { min: 1, max: 2 },
  };

  const totalPlayers = Object.values(playerTypeCount).reduce(
    (sum, count) => sum + count,
    0
  );
  if (totalPlayers >= MAX_PLAYERS) {
    return {
      valid: false,
      message: "Total players exceed the maximum allowed limit of 11.",
    };
  }

  if (rules[playerType]) {
    const { max } = rules[playerType];
    const currentCount = playerTypeCount[playerType] || 0;

    if (currentCount >= max) {
      return {
        valid: false,
        message: `You cannot have more than ${max} ${playerType}(s).`,
      };
    }
  }

  return { valid: true, message: "Player selection is valid." };
}
