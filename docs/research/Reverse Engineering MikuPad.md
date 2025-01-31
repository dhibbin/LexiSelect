# Reverse Engineering MikuPad

Mikupad allows the user to see the probabilities of tokens in the output text and to change the tokens as they see fit.

Mikupad takes a prompt form the user, like other AI interfaces, and returns an output using an AI backend (supporting llama/kobold/OpenAI). Instead of storing the output as a string of text returned from the API, Mikupad stores the output as an array of tokens (see [`setTokens()`](https://github.com/lmg-anon/mikupad/blob/main/mikupad.html#L4973)). Using the `n_probs` option within OpenAI's API, each token in this array also stores a list of alternative tokens that were not selected due to having a lower probability. 

Hovering over a token within the output will bring up a menu of all of the other potential tokens, all of which had a lower probability than the one that was actually returned in the output. Clicking on one of these tokens calls [`switchCompletion()`](https://github.com/lmg-anon/mikupad/blob/main/mikupad.html#L5493). This changes the prompt to include all generated tokens upto and including the selected token, allowing the AI to continue generation using the desired token instead of the (original) one with the highest probability. 

## Part 2

To create clickable text that can also be interacted with through typing/highlighting/deleting, Mikupad uses a text area layered underneath a series of span tags. The span tags link to their associated token in the program and list the alternative tokens. Clicking on the span tag itself allows you to click through to the text, allowing you to type.

These span tags have two types: machine and user
- Machine span tags represent tokens that have been generated by the AI, and indicate to the program whether or not they have associated tokens that need to be shown. Machine span tags highlight themselves when hovered over. 
- User span tags represent tokens that have been either modified by the user or strings that have been entirely made by the user. They don't highlight when hovered and don't link to any tokens. They contain the same text content as the textarea underneath so that the span tags that follow them remain aligned properly. 