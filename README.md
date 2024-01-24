# Mail Count
Count the number of daily emails using [Swiftbar](https://swiftbar.app) and [Scriptable](https://scriptable.app). To get an idea of when work was getting busy, I made a widget (iOS/Mac) to show the number of daily emails for the last four weeks.

The data is retrieved from Apple Mail on a regular schedule with Swiftbar, which runs a Python script, which in turn calls some AppleScript before saving a JSON data file to iCloud Drive. The graphical widget which retrieves and displays the data is written in JavaScript to work with Scriptable.

The only trick bit is you'll need to make a symlink from `mailcount.json` in the Swiftbar folder to the Scriptable iCloud Drive folder.

Hopefully there a few ideas here than can be useful or adapted for others' workflows.
