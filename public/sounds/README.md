# Audio Files for Wherizit Game

## Required Audio Files

Place the following audio files in this directory:

### Core Game Audio
- `win.mp3` - Sound that plays when the player wins the game
- `lose.mp3` - Sound that plays when the player loses the game

### Gameplay Audio
- `correct.mp3` - Sound for correct guesses (2-3 seconds)
- `incorrect.mp3` - Sound for incorrect guesses (1-2 seconds)
- `stage.mp3` - Sound for progressing to next stage (2-3 seconds)
- `hint.mp3` - Sound for using hints (1-2 seconds)

## File Requirements

- **Format**: MP3 (recommended) or WAV
- **Duration**: 
  - Win/Lose: 3-5 seconds
  - Correct/Stage: 2-3 seconds
  - Incorrect/Hint: 1-2 seconds
- **File Size**: Keep under 1MB each for fast loading
- **Quality**: 128kbps or higher for good audio quality

## How It Works

The game will automatically play audio for:

1. **Correct Guess** → `correct.mp3`
2. **Incorrect Guess** → `incorrect.mp3`
3. **Stage Progression** → `stage.mp3`
4. **Using Hints** → `hint.mp3`
5. **Game Win** → `win.mp3`
6. **Game Loss** → `lose.mp3`

## Audio Settings

- **Win/Lose sounds**: 70% volume
- **Gameplay sounds**: 60% volume
- **Auto-reset**: Audio automatically resets to beginning on each play
- **Error handling**: Graceful fallback if audio fails to load

## Recommended Audio Types

- **Win**: Triumphant, celebratory sound
- **Lose**: Short, gentle failure sound
- **Correct**: Positive, encouraging chime
- **Incorrect**: Brief, non-intrusive error sound
- **Stage**: Achievement, progression sound
- **Hint**: Light, helpful sound

## Troubleshooting

If you don't hear audio:
1. Check that all files are named exactly as specified
2. Ensure your browser allows autoplay
3. Check the browser console for any audio errors
4. Verify the audio files are valid MP3/WAV files
5. Try refreshing the page to reload audio files

## Audio File Sources

You can find free audio files from:
- Freesound.org
- Zapsplat.com
- Pixabay.com
- SoundBible.com

Make sure to use royalty-free or properly licensed audio files.
