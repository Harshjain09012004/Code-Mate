/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';
import typography from '@tailwindcss/typography';
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend:  {
      fontFamily: {
        cabin: ['Cabin', 'sans-serif'],
        marcellus: ['Marcellus', 'serif'],
        pacifico: ['Pacifico', 'cursive'],
        poppins: ['Poppins', 'sans-serif'],
        sora: ['Sora', 'sans-serif'],
      },
    },
  },
  plugins: [daisyui, typography,],
  daisyui: {
    themes: ["forest"]
  }
};

