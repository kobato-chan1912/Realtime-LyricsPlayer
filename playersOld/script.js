// get CurrentSong.
var CurrentPlay = [];
function appendId(object) {
   object.id = 100;
}

var userName;

Swal.fire({
   title: 'Nhập tên đăng nhập',
   input: 'text',
   inputAttributes: {
      autocapitalize: 'off'
   },
   confirmButtonText: 'Vào',
   showLoaderOnConfirm: true,
   preConfirm: (login) => {

      userName = login;
      $("video").prop('muted', false);
   },
   allowOutsideClick: () => !Swal.isLoading()
});
$('#message').on('keypress', function (e) {
   if (e.which === 13) {
      // console.log(userName);
      // console.log($('#message').val());
      firebase.database().ref("messages").push().set({
         "sender": userName,
         "message": $('#message').val()
      });

      $('#message').val('');

   }
});

// 

firebase.database().ref("messages").on("child_added", function(snapshot){
   var html = "";
   html+= `<div id="text-1"><span style="font-weight: bold;">${snapshot.val().sender}:</span> <span>${snapshot.val().message} </span></div>`;
   document.getElementById("chat-rev").innerHTML += html;
});


// Appending Data..
function appendData() {
   firebase.database().ref('playing').once('value').then(function (snapshot) {
      var tmp = null;
      var input = null;
      function ReadInput(file) {
         var rawFile = new XMLHttpRequest(); // XMLHttpRequest (often abbreviated as XHR) is a browser object accessible in JavaScript that provides data in XML, JSON, but also HTML format, or even a simple text using HTTP requests.
         rawFile.open("GET", file, false); // open with method GET the file with the link file ,  false (synchronous)
         rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) // readyState = 4: request finished and response is ready
            {
               if (rawFile.status === 200) // status 200: "OK"
               {
                  var allText = rawFile.responseText; //  Returns the response data as a string
                  input = allText;
               }
            }
         }
         rawFile.send(null); //Sends the request to the server Used for GET requests with param null
      }

      // Read RLC File. 

      ReadInput(snapshot.val().lyrics);
      console.log(input);


      var lyricsJSON;
      var lrc = new Lyric({
         onSetLyric: function (lines) {
            var obj = { lyrics: lines };
            lyricsJSON = JSON.stringify(obj);
         }
      })
      lrc.setLyric(input);

      var _data = JSON.parse(`${lyricsJSON}`);
      console.log(_data);

      var currenttext = "";

      function align() {
         var a = $(".highlighted").height();
         var c = $(".content").height();
         var d = $(".highlighted").offset().top - $(".highlighted").parent().offset().top;
         var e = d + (a / 2) - (c / 2);
         $(".content").animate(
            { scrollTop: e + "px" }, { easing: "swing", duration: 250 }
         );
      }

      var lyricHeight = $(".lyrics").height();
      $(window).on("resize", function () {
         if ($(".lyrics").height() != lyricHeight) { //Either width changes so that a text may take up or use less vertical space or the window height changes, 2 in 1
            lyricHeight = $(".lyrics").height(); // change lyrics height. 
            align(); // align
         }
      });







      // src for audio. 
      let url = snapshot.val().streamingURL + "#t=" + snapshot.val().playing_seconds;
      console.log(url);
      $("#music").attr('src', url).unbind("timeupdate").on("timeupdate", function () {
         var time = this.currentTime * 1000;
         var past = _data["lyrics"].filter(function (item) {
            return item.time < time;
         });
         if (_data["lyrics"][past.length] != currenttext) {
            currenttext = _data["lyrics"][past.length];
            $(".lyrics div").removeClass("highlighted");
            $(`.lyrics div:nth-child(${past.length})`).addClass("highlighted"); //Text might take up more texts, do before realigning
            align();
         }

      });

      $("#title").html(snapshot.val().title);
      $("#artist").html(snapshot.val().artist);
      $('#cover').css("background-image", `url(${snapshot.val().coverArt})`);


      $("video").on('timeupdate', function (e) {
         var time = this.currentTime * 1000;
         var past = _data["lyrics"].filter(function (item) {
            return item.time < time;
         });
         if (_data["lyrics"][past.length] != currenttext) {
            currenttext = _data["lyrics"][past.length];
            $(".lyrics div").removeClass("highlighted");
            $(`.lyrics div:nth-child(${past.length})`).addClass("highlighted"); //Text might take up more texts, do before realigning
            align();
         }
      });


      var updateCurrent = setInterval(function () {
         $("video").each(function () {
            var previousTime = 0;
            // var currentTime = 0;
            var seekStart = null;
            var player = $(this);
            // console.log(this.currentTime);

            if (this.currentTime == this.duration) { // if end player. 

               clearInterval(updateCurrent);

               


               firebase.database().ref('playlist').once('value', function (snapshot) {
                  var nextArtist, nextTitle, nextCoverArt, nextStreaming, nextLyrics;
                  snapshot.forEach(function (childSnapshot) {
                     if (!nextArtist) {
                        nextArtist = childSnapshot.val().artist;
                        nextTitle = childSnapshot.val().title;
                        nextCoverArt = childSnapshot.val().coverArt;
                        nextStreaming = childSnapshot.val().streamingURL;
                        nextLyrics = childSnapshot.val().lyrics;
                        firebase.database().ref("playing").update({
                           "artist": nextArtist,
                           "coverArt": nextCoverArt,
                           "lyrics": nextLyrics,
                           "streamingURL": nextStreaming,
                           "title": nextTitle,
                           "playing_seconds": 0
                        });
                     }
                  });
                  // update new playing.

               });

               // Delete the first element in playlist // 
               var firstID = $("#track-list").children()[0].id;  // id in HTML Page.
               var stringID = firstID.replace("track", ""); // id in Database. 
               firebase.database().ref("playlist").child(stringID).remove();
               $('#' + firstID).remove();




               

            }


         });
      }, 1000);

      generate();

      function generate() {
         var html = "";
         for (var i = 0; i < _data["lyrics"].length; i++) {
            html += "<div";
            if (i == 0) {
               html += ` class="highlighted"`;
               currenttext = 0;
            }
            if (_data["lyrics"][i]["note"]) {
               html += ` note="${_data["lyrics"][i]["note"]}"`;
            }
            html += ">";
            html += _data["lyrics"][i]["text"] == "" ? "•" : _data["lyrics"][i]["text"];
            html += "</div>"
         }
         $(".lyrics").html(html);
         align();
      }

   });
}
appendData();


// append for current event. 

// Catching in child_changed playing. 
firebase.database().ref("playing").on("child_added", function (snapshot) {
   appendData();
});

firebase.database().ref("playlist").on("child_added", function (snapshot) {
   var html = "";
   html += `<div clá id='track${snapshot.key}'>`;
   html += '<div class="trackplay"><div class="play"><button class="bubbly-button"';
   html += `style="background-image: url(${snapshot.val().coverArt})"></button></div><div class="trackname">`
   html += `<div class="title_playlist">${snapshot.val().title}</div>`;
   html += `<div class="title_playlist">${snapshot.val().artist}</div>`;
   html += '</div></div>';
   // console.log(html);

   // if(snapshot.val().sender == myName){
   //     html += "<button data-id='" + snapshot.key + "' onclick='deleteMessage(this);'>";
   //     html += "Delete";
   //     html += "</button>";
   // }
   // html+= snapshot.val().sender + ": " + snapshot.val().message;
   // html+= "</li>";
   document.getElementById("track-list").innerHTML += html;

});