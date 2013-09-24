  
        var API_KEY = 'dj0yJmk9RkxOQUtxdk9uQXFNJmQ9WVdrOWVETjZNMVIzTjJjbWNHbzlPVFkxTXpVMU5UWXkmcz1jb25zdW1lcnNlY3JldCZ4PTdk';
        
        $(document).ready(function() {
            /*var dataObj = {
                api_key : API_KEY,
                method : 'flickr.photos.search',
                tags: 'shiba inu',  //what do you want to search for?
                sort: 'relevance',
                media: 'photos',
                format: 'json',
                content_type: 1,
                nojsoncallback: 1
            };*/

            var dataObj = {
                // set the query string parameters here
                count: 40, //defaults the results to 40

            };

            $.ajax({
                //url: 'http://feeds.delicious.com/v2/json/tag/dog', //looks up recent bookmarks with the tag 'dog'
                url: 'http://feeds.delicious.com/v2/json/recent',
                data: dataObj,
                dataType: 'jsonp',
                })
            .done(function(data){
                //alert("success");
                var info = data;
                //console.log(info);
                for (var i = 0; i < 20; i++) {
                    var test = info[i];
                    var div = buildDiv(test.a, test.d, test.u, test.n, test.t);
                    $('#gallery').append(div);
                    //console.log(test);
                }
                console.log("Done");
                    })
            .fail(function(xhr, e) {
                console.log(e);
            });                     
        });         
         
        //this function is not used yet 
        function buildLink(farm, server, id, secret) {
          return 'http://farm' + farm + '.staticflickr.com/' + server + '/' + id + '_' + secret + '.jpg'    
        }
        
        function buildDiv(user, title, link, text, tags) {
           //This replaces any null values with 'N/A'
           if (user == '') {
            user = 'N/A';
            } else if (title == '') {
                title = 'N/A';
            } else if (link == '') {
                link = 'N/A';
            } else if (text == '') {
                text = 'N/A';
            } else if (tags == '') {
                tags = 'N/A';
            }

           var div = $('<div></div>')
                        .append('<p>' + 'User: ' + user + ' | Title: ' + title + ' | URL: ' + link + ' | Text: ' + text + ' | Tags: ' + tags + '</p>');
           return div;
        }