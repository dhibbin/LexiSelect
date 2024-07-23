# Tuesday July 23

Trying to access Vuetify DOM elements
- Took roughly 2 hours
- Many guides online explained that using the `ref=` argument would allow you to access the DOM element within the script of the SFC
- However attempting to do this with Vuetify components didn't work
- I set up a test component to try it with default HTML elements and it worked
- I figured out what I needed to do to get references to Vuetify DOM elements and will try to lerp the height
- Also set up a delay for collapsing the alternative token menu so you can move the mouse around without it closing instantly

Lerping height
- Took roughly 1.5 hours
- Created a virtual menu that is invisible so the script can know what the target height for `'min-content'` is. 
- Tried creating a watcher for the client rect of the menu, however that didn't work. 
- Discovered that I actually needed a resizeObserver to observe the virtual menu in order to call a function whenever the size of the virtual menu changes
- Using this I could lerp the height of the real menu whenever the desired size changes

Troubleshooting height and setting up more for continuing generation
- Took 2 hours
- Lerping the height had some issues which I tried to troubleshoot, couldn't figure it out and will return to it later
- Set up a system for transferring relevant data between the branches and the tree component, so it can be sent to the output boxes in the TextBar component
- The active branch (most recently created) is highlighted in a different colour, will need to create a smarter system to determine active branch