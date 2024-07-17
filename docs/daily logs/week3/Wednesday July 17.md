# Wednesday July 17

Morning meeting
- Took roughly 50 minutes
- Discussed need to make readme more user-friendly and presentable 
- Also discussed ideas for improving the layout and design of page

Reverse engineering Mikupad part 2
- Took roughly 30 mins
- Figured out how span tags and textareas are used by mikupad in order to have interactive text

Setting up the text tree component 
- Took roughly 3.5 hours
- Searched for a way to get textareas scrolling horizontally without ever allowing different lines to be entered
	- This doesnt work since textareas always allow new lines to be entered
- Switched the input to a standard input element, this can scroll horizontally as much as I want while preventing newlines 
- Tried to get span tags generating based off of the content of the text area and layered on top of it
	- Doing this is quite difficult since using absolute positioning means they all get created ontop of each other
	- Using inline means that they do stack horizontally but they do not allow themselves to be hovered over in front of the text for some reason
- Tried to get VueJS to put explicit spaces into the innerHTML
	- For some reason VueJS does some kind of formatting and just discards explicit html spaces when rendering, meaning that if a space doesn't appear between two non-space characters, it is just ignored
	- Since the span tags are invisible I can use any character to replace the space character, but if this becomes the problem down the line I will need to figure this out