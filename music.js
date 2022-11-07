const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: {},
  
  songs: [
    {
      name: "Dynasty",
      singer: "Miia",
      path: "./Music/Dynasty.mp3",
      image: "https://yt3.ggpht.com/ytc/AMLnZu8p3la-UW-fAeb_a2tMOjwGrexjEfC5KX9damGC=s900-c-k-c0x00ffffff-no-rj"
    },
    {
      name: "Waiting For You",
      singer: "MONO",
      path: "./Music/WaitingForYou.mp3",
      image:
        "https://image.thanhnien.vn/w1024/Uploaded/2022/mftum/2022_08_15/mono-4-8195.jpg"
    },
    {
      name: "Attention",
      singer: "Charlie Puth",
      path:
        "./Music/Attention.mp3",
      image: "http://nhaccuthienphuc.com/wp-content/uploads/2017/05/Attention.jpg"
    },
    {
      name: "Bad Day",
      singer: "Daniel Powter",
      path: "./Music/Bad Day.mp3",
      image:
        "https://thumbs.dreamstime.com/b/very-bad-day-nature-sky-bad-day-sky-text-184331183.jpg"
    },
    {
      name: "Light Switch",
      singer: "Charlie Puth",
      path: "./Music/LightSwitch.mp3",
      image:
        "https://i.scdn.co/image/ab67616d0000b27375d950842ab17159f0bb9479"
    },
    {
      name: "Loser",
      singer: "Charlie Puth",
      path:
        "./Music/Loser.mp3",
      image:
        "https://i.ytimg.com/vi/0NXUj7dJ6tM/maxresdefault.jpg"
    },
    {
      name: "Nevada",
      singer: "Vicetone",
      path: "./Music/Nevada.mp3",
      image:
        "https://i.ytimg.com/vi/AnMhdn0wJ4I/maxresdefault.jpg"
    }
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
  
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `  
                        <div class="song ${
                          index === this.currentIndex ? "active" : ""
                        }" data-index="${index}">
                            <div class="thumb"
                                style="background-image: url('${song.image}')">
                            </div>
                            <div class="body">
                                <h3 class="title">${song.name}</h3>
                                <p class="author">${song.singer}</p>
                            </div>
                            <div class="option">
                                <i class="ti-more"></i>
                            </div>
                        </div>
                    `;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      }
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, // 10 seconds
      iterations: Infinity
    });
    cdThumbAnimate.pause();

    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    repeatBtn.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");

      if (songNode || e.target.closest(".option")) {
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }

        if (e.target.closest(".option")) {
        }
      }
    };
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }, 300);
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {

    this.loadConfig();

    this.defineProperties();

    this.handleEvents();

    this.loadCurrentSong();

    this.render();

    randomBtn.classList.toggle(".btn.active", this.isRandom);
    repeatBtn.classList.toggle(".btn.active", this.isRepeat);
  }
};

app.start();
