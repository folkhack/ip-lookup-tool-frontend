# Optimizing Images With "optimizt"

**NOTE:** optimizt is not built into `package.json` either with scripts or dev-dependencies! This is because the target developer may not need image optimization, or they may be bringing their own tools to the table for this.

https://github.com/343dev/optimizt

```bash
npm install @343dev/optimizt --global

# Optimize a single file
optimizt path/to/picture.jpg

# Optimize all jpg images in current directory
find . -iname \*.jpg -exec optimizt {} +

# Optimize all jpg, webp, and png images in current directory
find . \( -iname \*.jpg -o -iname \*.webp -o -iname \*.png \) -exec optimizt {} +
```
