# Friday July 19

Morning meeting
- Took roughly 30 mins
- Discussed better ways of creating interactable text
- Decided to switch to a system that isn't dependent on absolute left character offsets

Making the horizontal list
- Took roughly 2 hours
- Determined which component to use for the list, the `<v-list>` component
- Tried to install the Vue-Horizontal npm package, since it allows all element to stack horizontally. Spent a while messing with this since the IDE kept saying it was installed when it wasnt
- Gave up on using Vue-Horizontal and using flex CSS to get the elements to stack horizontally
- When using the tokens list it would create list items that couldn't be clicked on which was weird so spent time looking at examples to figure out why it was doing that
- Now all tokens are rendered in horizontal list, now I need to make them editable and display their alternative tokens 

Making them display their alternative tokens
- Took roughly 3 hours
- For my first attempt I tried to give every single token element in the horizontal list its own list of token element that are hidden by a transition animation 
- Turns out that trying to render 128 CSS transition animations at once causes the browser to lag and clicking list elements was delayed in responding
- So I moved the list out of being directly underneath each token. This works but an offset has to be applied to the singular list in order for it to appear underneath each token as you highlight them. Resorting back to the character offset doesn't work since there seems to be a minimal amount of padding between each list element
- Additionally I couldn't get the list element to be clickable, despite (as far as I was aware) the list being the same as before. After searching for answers I realised that I have to place v-list-items in the list wrapper or else they do not function properly
- Most of my time however was searching for ways to directly access DOM elements or pass down properties (such as the CSS left property) down to a function in typescript. All of the documentation online is for the options API and seems to reference features that were only present in Vue 2