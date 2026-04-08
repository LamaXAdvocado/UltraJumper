// ============================================================
//  game-hooks.js
//  Drop your custom code into the functions below.
//  This file is loaded by the main game HTML.
// ============================================================

/**
 * Called when the player clicks "Next Level".
 * @param {number} newLevel - the level number being loaded next
 */
function onNextLevel(newLevel) {
  // --- YOUR CODE HERE ---
  console.log("Next Level clicked, loading level:", newLevel);
}

/**
 * Called when the player clicks "Retry".
 * @param {number} currentLevel - the level being retried
 */
function onRetry(currentLevel) {
  // --- YOUR CODE HERE ---
  console.log("Retry clicked, retrying level:", currentLevel);
}

/**
 * Called when the player clicks "Main Menu" from any screen.
 */
function onMainMenu() {
  // --- YOUR CODE HERE ---
  console.log("Returned to main menu");
}
