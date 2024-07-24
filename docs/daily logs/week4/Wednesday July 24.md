# Wednesday July 24

Morning meeting
- Took roughly 20 minutes
- Discussed progress after the next few days and where the project should be taken once essential features are complete

Connected branches to textbar via the tree and app
- Took roughly 1.1 hours
- Confusion about why watchers weren't being triggered when watching an array of reactive interfaces, turns out I need to set deep to true for the watcher
- Tried setting up a dragger for the textbar component so I can drag the input/output bar up and down to expand the text boxes within it
	- Need to get back to this later

TextTree MVP and adding custom inputs to branches
- Setup emits and props necessary for new branches to be created whenever an alternative token is selected or a new response is requested
- Added system where clicking on tokens allows the typing in of custom tokens
- TextBar output tab properly displays the content of all the branches
- Each text area in the output tab allows the user to continue generation for that branch 