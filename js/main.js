$(document).ready(function() {


	//PART 1
	//1. Create an event handler for the "loadBookmarks" form submit event. 
	$("#loadBookmarks").on("click", function(){
		var username = $('#sourceUser').val();
		var urlstring = 'http://feeds.delicious.com/v2/json/' + username;
		console.log(urlstring);

		$.ajax({
                //url: 'http://feeds.delicious.com/v2/json/iolab',
                url: urlstring,
                //data: dataObj,
                dataType: 'jsonp',
            })
		.done(function(data){
			console.log("success");
			var info = data;
                //console.log(info);
                for (var i = 0; i < info.length; i++) {
                	var test = info[i];
                	
                	var url = test.u;
                	var tag = test.t;
                	
                	console.log(url);
                	console.log(tag);
                	var div = generateBookmarkListItem(url, tag);

                    //console.log(test.t.length);
                    $('#bookmarks').append(div);
                    console.log(test);
                }
                console.log("Done");
            })
		.fail(function(xhr, e) {
			console.log(e);
		});   

		return false;
	});

$("#saveBookmarks > input[type='submit']").on("click", function() {
	var username = $('#targetUser').val();
	console.log(username);
	var password = $('#password').val();
	var trail = $('#trail').val();
	console.log(trail);

	$("input[type='checkbox']").each(function(){
		// this code would only include checked lines in the each function
		//$("input[type='checkbox']:checked").each(function(){ 
			//console.log("HELLO");
			if ($(this).is(":checked")) {
				//console.log("CHECKED!!!!");
				
				var link = $(this).siblings().attr("href");
				//console.log(link);
				var tags = $(this).parent().siblings().text();

				//console.log(tags);

				var dataObj = {
					url : link,
					//url : 'http://hotmail.com',
					username : username,
					password : password,
					tags : trail,
					replace : "yes",
				};

				$.ajax({
                url: 'delicious_proxy.php',
                //url: 'https://api.delicious.com/v1/posts/add?',
                type: "POST",
                data: dataObj,
                dataType: 'jsonp',
            })
				.done(function(data){
					console.log("PROGRESS!");
				})
				.fail(function(xhr,e) {
					console.log("post fail");
				});

			} /*else {
				console.log("Not Checked");
			}*/
		});

	//console.log("YO");	
	return false;
});






	//PART 2
	//1. Write another form event handler, this time for the "saveBookmarks" form. 

	//2. In the event handler, create an AJAX request to POST each of the checked bookmarks to the second Delicious account
	//    by way of the the proxy file you uploaded to your ISchool account.
	//	  You'll need to extract the url and tags back from each bookmark <li>
	//    Review http://delicious.com/developers to figure out which API method to use and what parameters are required

	//IMPORTANT NOTE: In order to test the request, you will need to Upload the contents of this lab (browser.html, js directory, 
	//css directory) and run it from the web (ex. http://people.ischool.berkeley.edu/~yourname/browser.html) 

	//PART 3 (Advanced/extra)
	//1. Edit the HTML of the form and modify your JavaScript code to allow the user to add new tags to the selected bookmarks
	//


	function generateBookmarkListItem(url, tag) {
		//markObj.u = url
	    //markObj.t = array of tags

	    var listItem = $('<li><div><input type="checkbox"> <a href="' + url + '">' + url 
	    	+ '</a></div><span class="tags">' + tag + '</span></li>');
	    return listItem;
	    //console.log(listItem);
	}


});
