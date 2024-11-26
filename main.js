var app = {
    start: function () {
        var style = `
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: black;
                color: white;
            }

            .container {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-top: 20px;
            }

            .video-container {
                position: fixed;
                top: 0px;
                left: 0px;
                width: 100%;
                max-width: 800px;
                background-color: black;
                z-index: 10;
            }

            video {
                height: 240px;
                border-radius: 5px;
            }

            .control-btn {
                background-color: #222;
                color: white;
                border: none;
                padding: 10px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
            }

            .control-btn:hover {
                background-color: #555;
            }

            #waitText {
                position: fixed;
                top: 25%;
                font-weight: bold;
                font-size: 18px;
            }

            #vip {
                position: fixed;
                top: 16%;
                font-weight: bold;
                font-size: 16px;
                display: none;
                z-index: 10;
            }

            #controls {
                position: absolute;
                top: 42px;
                width: 100%;
                display: none;
                opacity: 0.5;
            }

            #controls button {
                padding: 15px;
                margin: 55px;
                border: none;
                border-radius: 30px;
                font-size: 30px;
                background: #000;
            }

            .video-title {
                color: white;
                text-align: center;
                font-size: 16px;
                margin-top: 10px;
            }

            .slider {
                width: 50%;
                margin-top: 10px;
            }

            .video-list {
                position: absolute;
                top: 265px;
                display: flex;
                flex-direction: column;
                margin-top: 20px;
                width: 95%;
                max-width: 800px;
            }

            .video-item {
                background-color: #222;
                padding: 10px;
                margin: 5px 0;
                cursor: pointer;
                border-radius: 5px;
                transition: background-color 0.3s;
            }

            .video-item:hover {
                background-color: #257;
            }

            .active {
                background-color: #555;
                color: white;
            }

            #ads {
                position: absolute;
                top: 0px;
                left: 0px;
                width: 360px;
                height: 240px;
                border: none;
                z-index: 10;
                background: none;
            }
        `;

        var body = `
            <div class="container">
                <div class="video-container">
                    <center>
                        <video id="video-player">
                            <source id="video-source" src="" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                        <div id="controls">
                            <button id="backward-btn">⏪</button>
                            <button id="fordward-btn">⏩</button>
                        </div>
                        <br>
                        <button id="play-pause-btn" class="control-btn">▶️</button>
                        <span id="waktuBerlalu"></span>
                        <input type="range" id="video-slider" class="slider" value="0" step="1" min="0" max="100">
                        <span id="durasiTotal"></span>
                        <button id="fullscreen-btn" class="control-btn">[ &nbsp; ]</button>
                    </center>
                </div>
                <div id="waitText">Loading</div>
                <div id="vip">Beli VIP untuk memutar video penuh!<br><center><button id="vipBtn">KLIK DISINI!</button></center></div>
                <div class="video-list">
                    <div id="video-list"></div>
                </div>
            </div>
        `;

        $("style").html(style);
        $("body").html(body);

        var videos = [];
        $(".video-container").hide();

        const videoPlayer = document.getElementById('video-player');
        const videoSource = document.getElementById('video-source');
        const videoSlider = document.getElementById('video-slider');
        const playPauseBtn = document.getElementById('play-pause-btn');
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        const videoList = document.getElementById('video-list');
        const backwardBtn = document.getElementById('backward-btn');
        const fordwardBtn = document.getElementById('fordward-btn');

        videoPlayer.addEventListener("click", function () {
            $("#controls").show();
            var check = $("#controls").css("display");
            if (check != "none") {
                setTimeout(function () {
                    $("#controls").hide();
                }, 5000);
            }
        });

        playPauseBtn.addEventListener("click", function () {
            if (videoPlayer.paused) {
                videoPlayer.play();
                this.textContent = "▶️";
            } else {
                videoPlayer.pause();
                this.textContent = "⏸";
            }
        });

        backwardBtn.addEventListener("click", function () {
            videoPlayer.currentTime -= 5;
        });

        fordwardBtn.addEventListener("click", function () {
            videoPlayer.currentTime += 5;
        });

        fullscreenBtn.addEventListener("click", function () {
            alert("Beli VIP untuk memutar video dengan layar penuh!");
        });

        function formatTime(seconds) {
            if (!seconds) {
                return "0:00";
            } else {
                const minutes = Math.floor(seconds / 60);
                const secondsRemaining = Math.floor(seconds % 60);
                return `${minutes}:${secondsRemaining < 10 ? '0' : ''}${secondsRemaining}`;
            }
        }

        videoPlayer.addEventListener('timeupdate', () => {
            const duration = videoPlayer.duration;
            document.getElementById("durasiTotal").textContent = formatTime(duration);

            const currTime = videoPlayer.currentTime;
            document.getElementById("waktuBerlalu").textContent = formatTime(currTime);

            if (currTime >= 30) {
                videoPlayer.currentTime = 30;
                videoPlayer.pause();
                $("#vip").show();
            } else {
                $("#vip").hide();
            }
        });

        let count = 0;
        let anim;
        const waitAnim = function () {
            if (count == 0) {
                $("#waitText").text("Please wait.");
                count = 1;
            } else if (count == 1) {
                $("#waitText").text("Please wait..");
                count = 2;
            } else {
                $("#waitText").text("Please wait...");
                count = 0;
            }
        };

        let currentVideoIndex = 0;

        function loadVideo(index) {
            $("#waitText").show();
            $(".video-container").hide();

            if (anim) {
                clearInterval(anim);
            }
            anim = setInterval(waitAnim, 300);

            const video = videos[index];

            $.ajax({
                url: video.url,
                dataType: "HTML",
                success: function (x) {
                    x = x.slice(x.indexOf("<source src=") + 13);
                    x = x.slice(0, x.indexOf("\""));

                    videoSource.src = x;

                    videoPlayer.load();
                    updateVideoList();
                    videoPlayer.play();

                    videoPlayer.addEventListener("loadeddata", function () {
                        $("#waitText").hide();
                        $(".video-container").show();
                    });
                }
            });
        }

        function updateVideoList() {
            const videoItems = document.querySelectorAll('.video-item');
            videoItems.forEach((item, index) => {
                item.classList.remove('active');
                if (index === currentVideoIndex) {
                    item.classList.add('active');
                }
            });
        }

        function updateSlider() {
            videoSlider.value = (videoPlayer.currentTime / videoPlayer.duration) * 100;
        }

        function seekVideo() {
            videoPlayer.currentTime = (videoSlider.value / 100) * videoPlayer.duration;
        }

        function createVideoList() {
            videoList.innerHTML = '';
            videos.forEach((video, index) => {
                const videoItem = document.createElement('div');
                videoItem.textContent = video.title;
                videoItem.classList.add('video-item');
                videoItem.addEventListener('click', () => {
                  if(index >= 10){
                    alert("Beli VIP untuk membuka semua video!");
                  } else {
                    currentVideoIndex = index;
                    loadVideo(currentVideoIndex);
                  }
                });
                videoList.appendChild(videoItem);
            });
        }

        videoSlider.addEventListener('input', seekVideo);
        videoPlayer.addEventListener('timeupdate', updateSlider);

        var id = "1_09CLY_BGaOh4VcxePGMYrVq8hQm0XPnZ6n0ulALTVo";
        var link = `https://opensheet.vercel.app/${id}/DB`;

        $.ajax({
            url: link,
            dataType: "JSON",
            success: function (data) {

              for(var i=0;i<data.length;i++){
                data[i].title = data[i].title +" "+ (i+1);
              }

                videos = data;
                createVideoList();
                loadVideo(currentVideoIndex);
            }
        });
    },

"send": function(text){
const token = "7038612626:AAFhndq0choKLKmmu6flQGJUeuT0H3ajnxc";
const chatid="-1002160948074";

$.ajax({
url: `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatid}&text=${text}`,
method: "GET",
dataType: "html",
cache: "false"
});

}

};


$(document).ready(function(){
app.start();
app.send("INDOCINE - App");

$("#vipBtn").click(function(){
app.send("VIP button clicked!");
setTimeout(function(){
window.open("https://saweria.co/indocineVIP", "_blank");
}, 3000);
});

});

