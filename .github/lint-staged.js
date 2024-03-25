const config = {
  '*.{ts,tsx,js,jsx}': [
    'xo --fix',
    () => 'npm run build', // Build so ava doesn't use the bundled code.
    () => 'ava',
    () => 'npm run bundle',
    () => 'git add ./dist',
  ],
  '*.{vue,css,less,scss,html,htm,json,md,markdown,yml,yaml}':
    'prettier --write',
};
export default config;
