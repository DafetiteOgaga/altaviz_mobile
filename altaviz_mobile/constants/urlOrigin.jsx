const baseUrl = __DEV__
  ? 'http://192.168.43.214:8000' // Local development server
  : 'https://altavizapp.pythonanywhere.com'; // Production API

console.log(`Base URL: ${baseUrl}`);

export { baseUrl };


// export const baseUrl = 'http://192.168.43.214:8000'
// export const baseUrl = 'https://altavizapp.pythonanywhere.com'
