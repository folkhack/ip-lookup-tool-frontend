# Creating Application Demo GIF

* Used for `README.md` since GIFs are guaranteed to render
* Uses Peek for original recording - https://github.com/phw/peek
* Uses Gifsicle for GIF optimization - https://www.lcdf.org/gifsicle/

```bash
# Generate palette.png which is used for sampling colors
# - `app_demo.webm` is input video file
# - `palette.png` is output pallete file
# - `-ss 0.8` starts 0.8 seconds into video
# - `-t 7` only take 7 seconds from start `-ss` start point
ffmpeg -ss 0.8 -t 7 -i app_demo.webm -filter_complex "[0:v] palettegen" palette.png

# Convert video to GIF using pallete
# - `app_demo.webm` is input video file
# - `palette.png` is input pallete file from previous step
# - `app_demo.gif` is unoptimized output GIF file
# - `fps=10` define FPS for output GIF
# - `scale=650:-1` width scaled down to 650px, height is -1 which means resize mainatining
#      asepect ratio
# - `-ss 0.8` starts 0.8 seconds into video
# - `-t 7` only take 7 seconds from start `-ss` start point
ffmpeg -ss 0.8 -t 7 -i app_demo.webm -i palette.png -filter_complex "[0:v] fps=10,scale=650:-1 [new];[new][1:v] paletteuse" app_demo.gif

# Optimize GIF
# - `app_demo.gif` is unoptimized input GIF file
# - `app_demo_gifsicle.gif` is optimized output GIF file
# - `-O3` (capital ‘O’) is an optimization level that tries many compression methods
# - `—lossy` enables lossy compression which reduces the size considerably
gifsicle -O3 --lossy=100 app_demo.gif -o app_demo_gifsicle.gif
```
