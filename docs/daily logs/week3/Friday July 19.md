# Friday July 19

Morning meeting
- Took roughly 30 mins
- Discussed better ways of creating interactable text
- Decided to switch to a system that isn't dependent on absolute left character offsets

Making the horizontal list
- Determined which component to use for the list, the `<v-list>` component
- Tried to install the Vue-Horizontal npm package, since it allows all element to stack horizontally. Spent a while messing with this since the IDE kept saying it was installed when it wasnt
- Gave up on using Vue-Horizontal and using flex CSS to get the elements to stack horizontally
- When using the tokens list it would create list items that couldn't be clicked on which was weird so spent time looking at examples to figure out why it was doing that
- Now all tokens are rendered in horizontal list, now I need to make them editable and display their alternative tokens 