import { defineStore } from "pinia";
import { ref } from "vue";
import type { Song } from "@/types/Song";

export const useHistoryStore = defineStore("history", () => {
  const songs = ref<Song[]>(getLocalData());

  function getLocalData() {
    return JSON.parse(localStorage.getItem("songs") || "[]") as Song[];
  }

  function setLocalData() {
    localStorage.setItem("songs", JSON.stringify(songs.value));
  }

  function getSongs() {
    return songs.value;
  }

  async function addSong(id: string) {
    removeSong(id);

    try {
      const j = await (
        await fetch(`https://api.paugram.com/netease/?id=${id}`)
      ).json();

      if (j.title) {
        songs.value.unshift({
          id: id,
          title: j.title,
          artist: j.artist,
          cover: j.cover,
          media: j.link,
          lyrics: j.lyric,
        });
        setLocalData();
        return true;
      }
    } catch (e) {}
    return false;
  }

  function removeSong(id: string) {
    songs.value = songs.value.filter((s) => s.id !== id);
    setLocalData();
  }

  return {
    getSongs,
    addSong,
    removeSong,
  };
});
