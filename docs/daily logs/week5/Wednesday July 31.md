# Wednesday July 31

Tasks completed
- Extended the settings menu
	- Rewrote how the settings menu works
	- Now new settings can be created by just adding a new key and calling `newContents()`
	- Added function that dynamically creates rules based on a min/max value, variable name and whether the value should be an integer
	- The first textfield is being detected as a contacts field by safari for some reason and I couldn't diagnose why it is
- Fixed dragging the textbar
	- Dragging the textbar up and down didn't work which caused confusion
	- Turns out I accidentally deleted a watcher and thats why the height wasn't changing properly
- Fixed generating for old branch
	- Generating content for an old branch would always generate for the latest branch
	- Now the active branch index is updated using the provided index from the textbar