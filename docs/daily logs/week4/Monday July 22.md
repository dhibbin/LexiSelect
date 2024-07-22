# Monday July 22

Morning meeting
- Took roughly 30 mins
- Discussed problems accessing dom elements in VueJS. 
- David introduced me to `$event` which can be used to access the actual event information upon an event
- I didnt find this on Friday for some reason, regardless I can use this to access DOM elements to make it so the element list appears correctly underneath the corresponding token

Making the alternative tokens appear underneath their tokens
- Took roughly 1.25 hours
- This only took so long because I was dealing with problems trying to ensure that the tokens appear correctly under elements that start off offscreen (requiring scrolling to get to them)
- I originally tried placing the alternative token list outside the scrollable div, which did work but I didn't like how it overlayed and foresaw problems using this across multiple text tree components 
- I moved it back in and overcomplicated the problem by trying to track the currently highlighted element and have a computed value for the scroll offset
- I realised that it could be much simpler and just constantly track the scroll offset, setting a fixed offset for the token list when a new token is highlighted
- This allows the token list to follow tokens using only two numbers tracking the scroll offset

Get different branches showing when alternative tokens selected
- Took roughly 3 hours
- Renamed TextTree to TextBranch and created a new TextTree component that wraps the functionality of TextBranch. This is so that new generations and continued generations can be handled by a higher level object. 
- Now the TextTree can have multiple TextBranches all with different tokens and generations
- This took a while because I messed up the watchers within TextBranch and data wasn't being correctly passed to the TextBranch until I diagnosed the issue

Animating the alternative token menu
- Took roughly 1 hour
- Tried delaying the expansion transition and switching to relative positioning so that the alternative menu effects branches below it
- This worked initially but the expansion transition caused some unexpected behaviour
- Tried to figure out a way to lerp the height between two different min-content values but haven't fully figured that out yet