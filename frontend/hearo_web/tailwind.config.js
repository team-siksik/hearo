/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  // html에서 사용하지 않는 클래스는 삭제해서 build함
  purge: {
    enabled: true,
    content: ['./public/**/*.html'],
  },
}

