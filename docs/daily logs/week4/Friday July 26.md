Morning meeting 
- Took roughly 30 mins

Making the textbar move-able up and down
- Took roughly 3 hours
- Getting a draggable button that would adjust the height was surprisingly easy, linking up mousedown/mouseup from the window and using a ref for the height was all I really needed to do
- The hard part was getting the textareas to fill the height of the app-bar once it had been changed
- I tried **a lot** of ways to get this done and they all failed due to Vuetify adding a weird wrapping component that added needless space
- In the end I figured out a scuffed solution that would round down to the nearest number of text lines given a height measured in pixels. Then whenever the height changes you just change the number of rows in the text areas

Fixing the lerping height of the alternative token window
- Took roughly 2 hours
- I thought this would be brief so I could move on to commenting the codebase and setting up GitHub actions, but I was wrong
- The height of the alternative tokens window was lerping incorrectly and I couldnt figure out why, so I tried setting up a different system for changing the height by using watchers, but the watchers wouldn't work for seemingly no reason
- Instead I tried using the onUpdate() lifecycle hook to check for a difference between the virtual menu and the real menu's height and to lerp the real menu height if there if
- But for some reason this doesn't always change the height and I can't figure out why