$(document).ready(function() {
	/*----------------------------
	  Ashley: Variable Declaration
	  ----------------------------*/
	var url = [], 
		tags = [], 
		objectList = [],
		tagSelector = $("#tagSelector"),
		bookmarks = $("#bookmarks"),
		sourceUser = $("#sourceUser"),
		tagSelect = $("#tagSelect"),
		loadBookmarks = $("#loadBookmarks"),
		saveBookmarks = $("#saveBookmarks"),
		targetUser = $("#targetUser"),
		userPassword = $("#password"),
		trailName = $("#trail"),
		frame = $("#frame"),
		userBookmarks = $("#userBookmarks");
	
	//Animation to display the body of the page after 500 ms
	$("body").hide().fadeIn(500);
	
	/*----------------------
	  Ashley: Event Handlers
	  ----------------------*/
	/*-----------------------------------------------------------------------------------------------------------------------------------------------------------*/
	//#1. Event Handler for the 'submit' event on the 'loadBookmarks' form event source.
	/*-----------------------------------------------------------------------------------------------------------------------------------------------------------*/
	loadBookmarks.on("submit", function(event){
		//Prevent Default Action
		event.preventDefault();
		
		//Display the contents of the 'bookmarks' unordered list element after 500 ms
		bookmarks.hide().fadeIn(500);
		//Clear the contents of the tags and objectList arrays
		tags.length = 0;
		objectList.length = 0;
		
		//Display the 'tagSelector' DropDown Menu after 500 ms
		tagSelector.hide().fadeIn(500);
		
		//Create a Local Array to store 'unique' tag names
		var uniqueTags = [];
		
		//Clear the contents of the 'bookmarks' unordered list element
		bookmarks.html("");
		
		//Get the username from the 'sourceUser' field
		var username = sourceUser.val();
		
		//Create an AJAX request using JSONP to GET all bookmarks for the given user name
		$.getJSON('http://feeds.delicious.com/v2/json/' + username + '?callback=?'
		).always(function() {
			console.log("Request Complete.");
		}).done(function(data){
			//Loop through each Object returned from Delicious
			$(data).each(function() {
				//Store the url contained in each Object in the 'url' Array
				url.push(this.u);
				//Store each Object in the 'objectList' Array
				objectList.push(this);
				
				//Check for the condition where an Object does not have a Tag Name Array. If this is the case then do not store the Tag Name for that Object
				if(this.t !== ""){
					//Store the tag name Array contained in each Object in the 'tags' Array
					tags.push(this.t);
					//Loop through each element of each Tag Name Array
					this.t.forEach(function(tagName){
						//Store each Tag Name String in the 'uniqueTags' Array
						uniqueTags.push(tagName);
					});
					//Invoke the function to generate the List Item Elements for each Object and append the results to the 'bookmarks' unordered list element
					bookmarks.append(generateBookmarkListItem(this));
				}
			});
			//Modify the 'uniqueTags' Array to only store unique Tag Name String
			uniqueTags = $.unique(uniqueTags);
			
			//Generate a Default Select Option Element
			tagSelect.html("<option selected>Choose a Tag</option>");
			
			//Loop through each Tag Name String element in the 'uniqueTags' Array
			uniqueTags.forEach(function(tagName){
				//Invoke the function to generate the Option elements of the 'tagSelect' select element
				buildTagDropDown(tagName);
			});
		}).fail(function(event) {
			console.log("Error: " + event);
		});
		
		//Prevent Default Action of the 'submit' event
		return false;
	});
	
	/*-----------------------------------------------------------------------------------------------------------------------------------------------------------*/
	//#2. Event Handler for the 'submit' event on the 'saveBookmarks' form event source.
	/*-----------------------------------------------------------------------------------------------------------------------------------------------------------*/
	saveBookmarks.on("submit", function(event){
		//Prevent Default Action
		event.preventDefault();
		
		/*-----------------------
		  Variable Declaration
	      -----------------------*/
		var username, 
			pwd, 
			link, 
			trail, 
			tagList = "", 
			checkedItems = 0;

			
		//Capture the delicious username, delicious password and trail name from the 'targetUser', 'password' and 'trail' fields respectively
		username = targetUser.val();
		pwd = userPassword.val();
		trail = trailName.val();
		
		//Loop through each 'checkbox' element
		$("input[type='checkbox']").each(function(index){			
			//Check if a 'checkbox' element has been checked or not
			//If the 'checkbox' element has been checked then proceed
			if(this.checked){
				//Jenton: the <a> tag is a sibling of the checkbox element. I am storing the url from the checked item in the variable 'link'.
				link = $(this).siblings("a").attr('href');
				console.log(link);
				//Post the checked URL to the Delicious account with the Trail Name as the tag.
				$.post("delicious_proxy.php", {username: username, password: pwd, url: link, tags: trail, replace: "yes"}
				).always(function() {
					console.log("Request Complete.");
				}).done(function(){
					console.log("URL added to Delicious");
				}).fail(function(event) {
					console.log("Error: " + event);
				});
				
				//Increment the Counter for the Number of Checked Items
				checkedItems++;

			} 

		});
		
		//If the Counter for the Number of Checked Items is still set to 0, inform the user to select a Bookmark before proceeding, ELSE proceed to submit the form
		if(checkedItems == 0){
			//Message informing the user to select a Bookmark
			alert("Please Select at least 1 bookmark in order to create a Trail");
			//Prevent Default Action of the 'submit' event
			return false;
		}

		//create a url string that points to the user's delicious page
		var userpage = "http://delicious.com/" + username + "/" + trail;	
		//update the iFrame to link to the Delicious page for the user specified in the 'username' field. It will link directly to the specified trail name as well.
		$("#frame").attr("src", userpage);

	});
	
	/*-----------------------------------------------------------------------------------------------------------------------------------------------------------*/
	//#3. Event Handler for the 'change' event on the 'tagSelect' dropdown event source.
	/*-----------------------------------------------------------------------------------------------------------------------------------------------------------*/
	tagSelect.on("change", function(){
		//Capture the value of Option element selected
		var selectedItem = $(this).val();
		//Clear the contents of the 'bookmarks' unordered list element
		bookmarks.html("");
		
		//Check if the value of the Option element that was seleceted is the Default Option i.e. Choose a Tag.
		//If a match is found then proceed ELSE check if the value of the Option element that was seleceted matches a Tag Name String in the 'tags' Array.
		if(selectedItem === "Choose a Tag"){
				//Loop through each element in each 'objectList' Array
				objectList.forEach(function(obj){
					//Invoke the function to generate the List Item Elements for each Object and append the results to the 'bookmarks' unordered list element
					bookmarks.append(generateBookmarkListItem(obj));
			});					
		}else
		//Loop through each Tag Array element in the 'tags' Array
		tags.forEach(function(item){
			//Loop through each element in each Tag Array 
			item.forEach(function(tagName){
				//If a match is found then proceed
				if(tagName === selectedItem){
					//Invoke the function to generate the List Item Elements for each Object and append the results to the 'bookmarks' unordered list element
					bookmarks.append(generateBookmarkListItem(objectList[tags.indexOf(item)]));
				}
			});
		});
	});
	
	/*-----------------------------------------------------------------------------------------------------------------------------------------------------------*/
	//Function to generate List Item elements of the 'bookmarks' Unordered List Element.
	/*-----------------------------------------------------------------------------------------------------------------------------------------------------------*/
	function generateBookmarkListItem(markObj) {
		// markObj.u = url
	    // markObj.t = array of tags
		//Create List Item elements using information from the Object passed in as an argument to the funtion
	    var listItem = $('<li><div><input type="checkbox"> <a href="' + markObj.u + '" target="frameViewer">' + markObj.u 
	    	+ '</a></div><span class="tags">' + markObj.t + '</span></li>');
		//Return the generated List Item element
	    return listItem;
	}
	
	/*-----------------------------------------------------------------------------------------------------------------------------------------------------------*/
	//Function to generate Option elements of the 'tagSelect' Select Element.
	/*-----------------------------------------------------------------------------------------------------------------------------------------------------------*/
	function buildTagDropDown(tag){
		//Append the Option elements to the 'tagSelect' select element
		tagSelect.append("<option value='" + tag + "'>" + tag + "</option>");
	}
});
