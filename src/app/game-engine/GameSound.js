export class GameSound {
  _audioCtx = new AudioContext()

  _loadedAudios = {}

  async loadSound({ id, url }) {
    if (this._loadedAudios[id]) return

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'audio/mp3',
      },
      method: 'GET',
    })
    const arrayBuffer = await response.arrayBuffer()
    const audioBuffer = await this._audioCtx.decodeAudioData(arrayBuffer)

    this._loadedAudios[id] = audioBuffer
  }

  async playSound({ id, loop = false, gain = 1 }) {
    const audioBufferSource = this._audioCtx.createBufferSource()
    const gainNode = this._audioCtx.createGain()
    audioBufferSource.buffer = this._loadedAudios[id]

    gainNode.gain.value = gain

    audioBufferSource.loop = loop
    audioBufferSource.connect(gainNode)
    gainNode.connect(this._audioCtx.destination)
    audioBufferSource.start(0)
  }
}
