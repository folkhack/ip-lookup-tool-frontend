// Enables importing CSS modules in a TypeScript file
declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}
