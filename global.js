/** 播放/暂停。 */
function play() {
    var id = document.getElementsByClassName('id-giver')[0];
    var player = document.getElementsByClassName('player')[0];
    var signal = document.getElementsByClassName('play')[0];
    if (player.paused) {
        if (id.value.length > 0) {
            update(id.value)
            id.value = null;
        }
        player.play();
        signal.innerText = '| |';
    }
    else {
        player.pause();
        signal.innerText = '▶';
    }
}

/** 更新歌曲信息。 */
function update(id) {
    var songObj = $.parseJSON($.ajax({
        url: "https://api.paugram.com/netease/?id=" + id,
        dataType: "json",
        async: false
    }).responseText);
    document.getElementById('page-title').innerText =
        songObj.title + ' - ' + songObj.artist + ' - Pterosaur 网页音乐播放器';
    document.getElementsByClassName('player')[0].src = songObj.link;
    document.getElementsByClassName('cover')[0].src = songObj.cover;
    document.getElementsByClassName('lyrics')[0].innerText = songObj.lyric;
    document.getElementsByClassName('song-title')[0].innerText = songObj.title;
    document.getElementsByClassName('song-author')[0].innerText = songObj.artist;
}

/** 确定解析模块。 */
function anamode(mode) {
    if (mode != 'netease') {
        alert('对该解析模块的开发尚未完成，敬请谅解。');
        return;
    }
    for (let i = 0; i < 4; i++)
        document.getElementsByClassName('mode')[i].setAttribute('class', 'mode');
    document.getElementById(mode).setAttribute('class', 'mode chosen');
}