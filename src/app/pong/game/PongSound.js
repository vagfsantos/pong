import { GameSound } from '@game-engine/GameSound'
import backgroundSound from 'url:../../../sound/background.mp3'
import coinSound from 'url:../../../sound/coin.wav'
import hit1Sound from 'url:../../../sound/hit1.mp4'
import hit2Sound from 'url:../../../sound/hit2.mp4'

const allSoundsUrls = [
  { url: backgroundSound, id: 'background' },
  { url: hit1Sound, id: 'hit1' },
  { url: hit2Sound, id: 'hit2' },
  { url: coinSound, id: 'coin' },
]

export class PongSound {
  Sound = new GameSound()

  bgSoundIsPlaying = false

  async loadAllSounds() {
    return Promise.all(
      allSoundsUrls.map(async ({ url, id }) => {
        await this.Sound.loadSound({
          url,
          id,
        })
      })
    )
  }

  playBackgroundSound() {
    if (!this._bgSoundIsPlaying) {
      this.Sound.playSound({
        id: 'background',
        loop: true,
        gain: 0.35,
      })
      this._bgSoundIsPlaying = true
    }
  }

  playUserHitPlaySound() {
    this.Sound.playSound({
      id: 'hit1',
      gain: 3,
    })
  }

  playMachineHitPlaySound() {
    this.Sound.playSound({
      id: 'hit2',
      gain: 3,
    })
  }

  playScoreSound() {
    this.Sound.playSound({
      id: 'coin',
      gain: 5,
    })
  }
}
